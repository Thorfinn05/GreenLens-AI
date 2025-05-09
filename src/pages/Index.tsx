import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  RecycleIcon, ImageIcon, ScanSearch, Database, Info, 
  Sparkles, Leaf, Upload, Microscope, BarChart4, Camera
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import PlasticInfo from "@/components/PlasticInfo";
import DetectionCanvas from "@/components/DetectionCanvas";
import JsonView from "@/components/JsonView";
import CameraCapture from "@/components/CameraCapture";
import { analyzeImage, PlasticDetection } from "@/services/geminiService";
import { useIsMobile } from "@/hooks/use-mobile";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detections, setDetections] = useState<PlasticDetection[]>([]);
  const [nonPlasticDetected, setNonPlasticDetected] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("results");
  const [inputMethod, setInputMethod] = useState<"upload" | "camera">("upload");
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const { currentUser } = useAuth();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (containerRef.current && imagePreview) {
      const containerWidth = containerRef.current.clientWidth;
      setCanvasSize({
        width: containerWidth,
        height: containerWidth * 0.75,
      });
    }
  }, [containerRef, imagePreview]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && imagePreview) {
        const containerWidth = containerRef.current.clientWidth;
        setCanvasSize({
          width: containerWidth,
          height: containerWidth * 0.75,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagePreview]);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setDetections([]);
    setNonPlasticDetected(false);
  };

  const saveDetectionToFirestore = async (detections: PlasticDetection[], nonPlasticDetected: boolean) => {
    if (!currentUser) {
      console.log("User not logged in, detection not saved to history");
      toast.warning("Sign in to save detection history");
      return;
    }

    try {
      // Extract plastic types from detections
      const detectedItems = detections.map(d => d.label);
      
      // Calculate average confidence
      const avgConfidence = detections.length > 0 
        ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length
        : 0;
      
      // Determine plastic type category based on detections
      let plasticType = "Unknown";
      if (detections.length > 0) {
        // If there's only one detection, use its label
        if (detections.length === 1) {
          plasticType = detections[0].label;
        } else {
          plasticType = "Mixed Plastics";
        }
      } else {
        plasticType = nonPlasticDetected ? "Non-Plastic Items" : "No Items Detected";
      }

      // Create the detection data object
      const detectionData = {
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        detectedItems: detectedItems,
        confidence: avgConfidence,
        plasticType: plasticType,
        nonPlasticDetected: nonPlasticDetected
      };
      
      // Save to Firestore
      await addDoc(collection(db, "detections"), detectionData);
      toast.success("Detection saved to your history");
    } catch (error) {
      console.error("Error saving detection to Firestore:", error);
      toast.error("Failed to save detection to history");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    
    setIsAnalyzing(true);
    setActiveTab("results");
    
    try {
      const result = await analyzeImage(selectedImage);
      setDetections(result.detections);
      setNonPlasticDetected(!!result.non_plastic_detected);
      
      // Save detection to Firestore for uploaded images
      if (currentUser) {
        await saveDetectionToFirestore(result.detections, !!result.non_plastic_detected);
      }
      
      if (result.detections.length === 0) {
        if (result.non_plastic_detected) {
          toast.info("No plastic items detected, but other materials were identified");
        } else {
          toast.info("No items detected in the image");
        }
      } else {
        toast.success(`Detected ${result.detections.length} plastic item${result.detections.length !== 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDetectionsReceived = (newDetections: PlasticDetection[], hasNonPlastic: boolean) => {
    setDetections(newDetections);
    setNonPlasticDetected(hasNonPlastic);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar className="border-b bg-glass backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="relative">
              <RecycleIcon className="h-7 w-7 text-eco-green-medium animate-float" />
              <div className="absolute inset-0 bg-eco-green-medium/20 rounded-full blur-md animate-pulse-subtle"></div>
            </div>
            <h1 className="text-2xl font-bold text-gradient">PlasticDetect AI</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
              Profile
            </Link>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
              Login
            </Link>
            <Link to="/signup" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
              Sign Up
            </Link>
            <span className="bg-eco-gradient text-xs font-medium text-white px-3 py-1 rounded-full animate-pulse-subtle">
              Powered by Gemini 2.5
            </span>
          </div>
        </div>
      </Navbar> */}

      
      <main className="flex-1 container py-6 md:py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Left column - Input Methods */}
          <div className="space-y-6 md:col-span-1 animate-slide-in-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="eco-icon animate-pulse-subtle">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-gradient">Image Source</h2>
              </div>
              
              <Card className="futuristic-card overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-eco-gradient opacity-10 rounded-full blur-xl -translate-y-12 translate-x-12"></div>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    Select Input Method
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to capture plastic items for detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs 
                    defaultValue="upload" 
                    value={inputMethod}
                    onValueChange={(value) => setInputMethod(value as "upload" | "camera")}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-full mb-4">
                      <TabsTrigger value="upload" className="data-[state=active]:bg-eco-gradient data-[state=active]:text-white">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </TabsTrigger>
                      <TabsTrigger value="camera" className="data-[state=active]:bg-eco-gradient data-[state=active]:text-white">
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-0">
                      <ImageUpload
                        onImageSelected={handleImageSelected}
                        disabled={isAnalyzing}
                      />
                      <div className="mt-6">
                        <Button 
                          onClick={handleAnalyze} 
                          disabled={!selectedImage || isAnalyzing}
                          className="eco-button w-full group"
                        >
                          {isAnalyzing ? (
                            <>
                              <Microscope className="mr-2 h-4 w-4 animate-pulse" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <ScanSearch className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                              Detect Plastic Items
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="camera" className="mt-0">
                      <CameraCapture 
                        onImageCaptured={handleImageSelected}
                        onDetectionsReceived={handleDetectionsReceived}
                        isAnalyzing={isAnalyzing}
                        setIsAnalyzing={setIsAnalyzing}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {detections.length > 0 && !isAnalyzing && (
                <Card className="futuristic-card animate-slide-in-bottom">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5 text-eco-teal" />
                      Detection Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Items Detected:</span>
                        <span className="bg-eco-gradient text-white text-sm font-bold px-3 py-1 rounded-full">
                          {detections.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Plastic Types:</span>
                        <span className="text-sm">
                          {Array.from(new Set(detections.map(d => d.label))).length} types
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Other Materials:</span>
                        <span className="text-sm">{nonPlasticDetected ? "Present" : "None"}</span>
                      </div>
                      {detections.length > 0 && (
                        <div className="pt-3 mt-3 border-t">
                          <PdfDownloadButton 
                            detections={detections} 
                            nonPlasticDetected={nonPlasticDetected}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Middle and right columns - Results */}
          <div className="space-y-6 md:col-span-1 lg:col-span-2 animate-slide-in-right">
            <div className="flex items-center gap-3 mb-2">
              <div className="eco-icon animate-pulse-subtle">
                <Database className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-gradient">Analysis Results</h2>
            </div>
            
            <div ref={containerRef}>
              {imagePreview && (
                <Card className="futuristic-card overflow-hidden shadow-lg mb-6 transition-all duration-300 hover:shadow-eco-glow animate-zoom-in">
                  <div className="p-3 md:p-6">
                    <DetectionCanvas 
                      imageUrl={imagePreview}
                      detections={detections}
                      width={canvasSize.width}
                      height={canvasSize.height}
                    />
                  </div>
                </Card>
              )}
              
              {imagePreview && !isAnalyzing && (
                <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab} className="animate-slide-in-bottom">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50 backdrop-blur-sm">
                    <TabsTrigger value="results" className="data-[state=active]:bg-eco-gradient data-[state=active]:text-white">
                      <Info className="h-4 w-4 mr-2" />
                      Plastic Information
                    </TabsTrigger>
                    <TabsTrigger value="json" className="data-[state=active]:bg-eco-gradient data-[state=active]:text-white">
                      <Database className="h-4 w-4 mr-2" />
                      JSON Data
                    </TabsTrigger>
                  </TabsList>
                  <div className="mt-6">
                    <TabsContent value="results" className="m-0">
                      <PlasticInfo 
                        detections={detections} 
                        nonPlasticDetected={nonPlasticDetected} 
                      />
                    </TabsContent>
                    <TabsContent value="json" className="m-0">
                      <JsonView detections={detections} />
                    </TabsContent>
                  </div>
                </Tabs>
              )}
              
              {!imagePreview && !isAnalyzing && (
                <Card className="futuristic-card p-8 text-center animate-pulse-subtle">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="rounded-full bg-eco-gradient p-6 animate-float">
                        {inputMethod === "upload" ? (
                          <ImageIcon className="h-10 w-10 text-white" />
                        ) : (
                          <Camera className="h-10 w-10 text-white" />
                        )}
                      </div>
                      <Sparkles className="absolute -right-2 -top-1 h-5 w-5 text-eco-cyan animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gradient">
                        {inputMethod === "upload" ? "No Image Selected" : "Camera Not Activated"}
                      </h3>
                      <p className="text-muted-foreground">
                        {inputMethod === "upload" 
                          ? "Upload an image to detect plastic waste items and learn how to recycle them."
                          : "Activate camera to detect plastic waste items in real-time."
                        }
                      </p>
                    </div>
                    <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                      <Leaf className="h-4 w-4 text-eco-green-medium" />
                      <span>Help save the environment by identifying recyclables</span>
                    </div>
                  </div>
                </Card>
              )}
              
              {isAnalyzing && (
                <Card className="futuristic-card p-8 text-center border-eco-teal/30">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="rounded-full bg-eco-gradient p-6 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-eco-teal animate-spin"></div>
                      <Microscope className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gradient">Analyzing Image</h3>
                      <div className="flex flex-col gap-3 max-w-md mx-auto">
                        <p className="text-muted-foreground">
                          Our advanced AI is carefully examining your image to detect and classify plastic waste items...
                        </p>
                        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div className="h-full bg-eco-gradient animate-gradient-shift rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4 bg-glass mt-auto">
        <div className="container flex flex-col items-center justify-between gap-3 md:h-16 md:flex-row">
          <div className="flex items-center gap-2">
            <RecycleIcon className="h-5 w-5 text-eco-green-medium" />
            <p className="text-sm text-gradient font-medium">
              GreenLens AI - Helping identify and classify plastic waste for better recycling
            </p>
          </div>
          <p className="text-sm bg-eco-gradient bg-clip-text text-transparent font-medium flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-eco-teal" />
            Powered by Gemini 2.5 Flash API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
