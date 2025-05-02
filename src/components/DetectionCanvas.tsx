
import { useEffect, useRef } from "react";
import { PlasticDetection } from "@/services/geminiService";

interface DetectionCanvasProps {
  imageUrl: string;
  detections: PlasticDetection[];
  width: number;
  height: number;
}

const colorMap: Record<string, string> = {
  "PET": "#E53935", // Red
  "HDPE": "#43A047", // Green
  "PVC": "#1E88E5", // Blue
  "LDPE": "#FDD835", // Yellow
  "PP": "#8E24AA", // Purple
  "PS": "#FB8C00", // Orange
  "Others": "#795548", // Brown
  "Unknown": "#607D8B" // Blue-grey
};

const getDetectionColor = (label: string): string => {
  for (const key in colorMap) {
    if (label.includes(key)) {
      return colorMap[key];
    }
  }
  return colorMap["Unknown"];
};

const DetectionCanvas = ({ imageUrl, detections, width, height }: DetectionCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Load the image
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      // Get original image dimensions
      const originalWidth = image.width;
      const originalHeight = image.height;
      
      // Calculate aspect ratio
      const aspectRatio = originalWidth / originalHeight;
      
      // Calculate dimensions to maintain aspect ratio
      let drawWidth = width;
      let drawHeight = drawWidth / aspectRatio;
      
      // If calculated height exceeds container height, adjust dimensions
      if (drawHeight > height) {
        drawHeight = height;
        drawWidth = drawHeight * aspectRatio;
      }
      
      // Center the image in the canvas
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fill background with light gray if the image doesn't fill the canvas
      if (offsetX > 0 || offsetY > 0) {
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw the image maintaining aspect ratio
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      
      // Draw detections
      if (detections.length === 0) {
        // Draw "No plastic detected" message if there are no detections
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, 50);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("No plastic detected in image", canvas.width / 2, 30);
        return;
      }
      
      detections.forEach((detection, index) => {
        const [x1, y1, x2, y2] = detection.bounding_box;
        
        // Scale bounding box to fit drawn image dimensions
        const boxX = offsetX + (x1 * drawWidth);
        const boxY = offsetY + (y1 * drawHeight);
        const boxWidth = (x2 - x1) * drawWidth;
        const boxHeight = (y2 - y1) * drawHeight;
        
        const color = getDetectionColor(detection.label);
        
        // Draw rectangle with slightly thicker border and semi-transparent fill
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.fillStyle = `${color}22`; // 13% opacity version of the color
        
        ctx.beginPath();
        ctx.rect(boxX, boxY, boxWidth, boxHeight);
        ctx.stroke();
        ctx.fill();
        
        // Add detection number to the top-left corner
        ctx.fillStyle = color;
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${index + 1}`, boxX + 12, boxY + 16);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeText(`${index + 1}`, boxX + 12, boxY + 16);
        
        // Prepare label text
        const itemDescription = detection.item_description 
          ? ` (${detection.item_description})` 
          : '';
        const labelText = `${detection.label}${itemDescription} ${Math.round(detection.confidence * 100)}%`;
        
        // Calculate text metrics
        ctx.font = "bold 14px sans-serif";
        const textMetrics = ctx.measureText(labelText);
        const padding = 6;
        const labelWidth = textMetrics.width + (padding * 2);
        const labelHeight = 22;
        
        // Position label at top of bounding box if possible, or below if at top of image
        let labelY = boxY - labelHeight;
        // If label would be off the top of the canvas, place it at the bottom of the bounding box
        if (labelY < 0) {
          labelY = boxY + boxHeight;
        }
        
        // Draw label background with rounded corners
        ctx.fillStyle = color;
        ctx.beginPath();
        const radius = 4;
        const labelX = boxX;
        ctx.moveTo(labelX + radius, labelY);
        ctx.lineTo(labelX + labelWidth - radius, labelY);
        ctx.quadraticCurveTo(labelX + labelWidth, labelY, labelX + labelWidth, labelY + radius);
        ctx.lineTo(labelX + labelWidth, labelY + labelHeight - radius);
        ctx.quadraticCurveTo(labelX + labelWidth, labelY + labelHeight, labelX + labelWidth - radius, labelY + labelHeight);
        ctx.lineTo(labelX + radius, labelY + labelHeight);
        ctx.quadraticCurveTo(labelX, labelY + labelHeight, labelX, labelY + labelHeight - radius);
        ctx.lineTo(labelX, labelY + radius);
        ctx.quadraticCurveTo(labelX, labelY, labelX + radius, labelY);
        ctx.closePath();
        ctx.fill();
        
        // Draw label text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(
          labelText,
          labelX + padding,
          labelY + 16
        );
      });
    };
  }, [imageUrl, detections, width, height]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      className="max-w-full h-auto rounded-md border shadow-md"
    />
  );
};

export default DetectionCanvas;
