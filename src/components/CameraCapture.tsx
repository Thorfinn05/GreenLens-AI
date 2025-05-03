
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, X, Loader2, Search, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { analyzeImage, PlasticDetection } from "@/services/geminiService";
import PdfDownloadButton from "@/components/PdfDownloadButton";

interface CameraCaptureProps {
  onImageCaptured: (file: File) => void;
  onDetectionsReceived: (detections: PlasticDetection[], nonPlasticDetected: boolean) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
}

const CameraCapture = ({ onImageCaptured, onDetectionsReceived, isAnalyzing, setIsAnalyzing }: CameraCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [detections, setDetections] = useState<PlasticDetection[]>([]);
  const [nonPlasticDetected, setNonPlasticDetected] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [autoDetect, setAutoDetect] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio feedback
  const playSound = () => {
    if (!enableSound) return;
    const audio = new Audio("/detection.mp3"); // Use your preferred sound
    audio.play();
  };

  // Get list of cameras
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const cams = devices.filter(d => d.kind === "videoinput");
        setAvailableCameras(cams);
      }).catch(err => {
        toast.error("Camera access error.");
        console.error(err);
      });
  }, []);

  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: isFrontCamera ? "user" : "environment" },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      toast.success("Webcam started");
    } catch (err) {
      toast.error("Failed to access webcam");
      console.error(err);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);
    setIsCameraActive(false);
    setDetections([]);
    setNonPlasticDetected(false);

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  const toggleCamera = async () => {
    setIsFrontCamera(!isFrontCamera);
    stopCamera();
    setTimeout(() => startCamera(), 500);
  };

  const drawDetections = (canvas: HTMLCanvasElement, detections: PlasticDetection[]) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !videoRef.current) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    detections.forEach(d => {
      // Changed from d.bbox to d.bounding_box to match the PlasticDetection interface
      const [x, y, w, h] = d.bounding_box;
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = "#00ff00";
      ctx.font = "14px Arial";
      ctx.fillText(`${d.label} (${Math.round(d.confidence * 100)}%)`, x + 4, y - 6);
    });
  };

  const handleDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;
  
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error("Failed to process video frame.");
        return;
      }
  
      const file = new File([blob], "frame.jpg", { type: "image/jpeg" });
      onImageCaptured(file);
      setIsAnalyzing(true);
  
      try {
        const result = await analyzeImage(file);
        setDetections(result.detections);
        setNonPlasticDetected(!!result.non_plastic_detected);
        onDetectionsReceived(result.detections, !!result.non_plastic_detected);
  
        if (result.detections.length === 0) {
          toast.info(result.non_plastic_detected ? "Non-plastic item(s) detected." : "No items detected.");
        } else {
          toast.success(`${result.detections.length} plastic item(s) detected.`);
          playSound();
        }
  
        // draw live boxes
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        result.detections.forEach(d => {
          // Changed from d.bbox to d.bounding_box to match the PlasticDetection interface
          const [x, y, w, h] = d.bounding_box;
          ctx.strokeStyle = "#00ff00";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, w, h);
  
          ctx.fillStyle = "#00ff00";
          ctx.font = "14px Arial";
          ctx.fillText(`${d.label} (${Math.round(d.confidence * 100)}%)`, x + 4, y - 6);
        });
  
      } catch (err) {
        toast.error("Detection failed.");
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, "image/jpeg", 0.95);
  };
  
  // Auto detection loop
  useEffect(() => {
    if (autoDetect && isCameraActive) {
      detectionIntervalRef.current = setInterval(() => {
        if (!isAnalyzing) {
          handleDetection();
        }
      }, 5000); // every 5 seconds
    } else if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [autoDetect, isCameraActive, isAnalyzing]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-4">
      <div className="w-full relative rounded-lg overflow-hidden bg-muted">
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {!isCameraActive ? (
          <Button onClick={startCamera} className="bg-eco-gradient hover:shadow-eco-glow">
            <Camera className="w-4 h-4 mr-2" />
            {isMobile ? "Open Camera" : "Open Webcam"}
          </Button>
        ) : (
          <>
            <Button onClick={handleDetection} disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-700">
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Detect Now
            </Button>

            {availableCameras.length > 1 && (
              <Button onClick={toggleCamera} variant="outline">
                <FlipHorizontal className="w-4 h-4 mr-2" />
                Flip
              </Button>
            )}

            <Button onClick={() => setAutoDetect(prev => !prev)} variant="outline">
              <Search className="w-4 h-4 mr-2" />
              {autoDetect ? "Stop Auto Detect" : "Auto Detect"}
            </Button>

            <Button onClick={() => setEnableSound(prev => !prev)} variant="outline">
              <Volume2 className="w-4 h-4 mr-2" />
              {enableSound ? "Mute" : "Sound On"}
            </Button>

            <Button onClick={stopCamera} variant="destructive">
              <X className="w-4 h-4 mr-2" />
              Close Webcam
            </Button>
          </>
        )}
      </div>

      {detections.length > 0 && (
        <div className="w-full bg-green-50 border border-green-300 p-4 rounded-md">
          <h4 className="font-semibold text-green-700 mb-2">Detected Items:</h4>
          <ul className="text-sm text-green-900 space-y-1">
            {detections.map((det, idx) => (
              <li key={idx}>
                <strong>{det.label}</strong> - {Math.round(det.confidence * 100)}%
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <PdfDownloadButton 
              detections={detections} 
              nonPlasticDetected={nonPlasticDetected} 
            />
          </div>
        </div>
      )}

      {nonPlasticDetected && detections.length === 0 && (
        <div className="text-sm text-yellow-700 p-2 border border-yellow-300 bg-yellow-50 rounded">
          Non-plastic items detected, but no plastics found.
        </div>
      )}
    </div>
  );
};

export default CameraCapture;