import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Grid, List, Layers } from "lucide-react";
import DetectionCanvas from "./DetectionCanvas";
import { PlasticDetection } from "@/services/geminiService";

interface DetectionDisplayProps {
  imageUrl: string;
  detections: PlasticDetection[];
  width?: number;
  height?: number;
}

const getDetectionColor = (label: string): string => {
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
  
  for (const key in colorMap) {
    if (label.includes(key)) {
      return colorMap[key];
    }
  }
  return colorMap["Unknown"];
};

const DetectionDisplay = ({ imageUrl, detections, width = 800, height = 600 }: DetectionDisplayProps) => {
  const [viewMode, setViewMode] = useState<"summary" | "detailed">("detailed");
  const [selectedDetection, setSelectedDetection] = useState<number | null>(null);

  // Group detections by plastic type for summary view
  const groupedDetections = detections.reduce((groups, detection, index) => {
    const type = detection.label.split('(')[0].trim();
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push({ ...detection, index });
    return groups;
  }, {} as Record<string, (PlasticDetection & { index: number })[]>);

  // Calculate statistics
  const totalDetections = detections.length;
  const plasticTypes = Object.keys(groupedDetections).length;
  const avgConfidence = detections.length > 0 
    ? Math.round(detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Detection Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detection Summary
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">{totalDetections} items</Badge>
              <Badge variant="outline">{plasticTypes} types</Badge>
              <Badge variant="outline">{avgConfidence}% avg confidence</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(groupedDetections).map(([type, typeDetections]) => {
              const avgTypeConfidence = Math.round(
                typeDetections.reduce((sum, d) => sum + d.confidence, 0) / typeDetections.length * 100
              );
              return (
                <div
                  key={type}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getDetectionColor(type) }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{type}</div>
                    <div className="text-sm text-muted-foreground">
                      {typeDetections.length} items • {avgTypeConfidence}% confidence
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">View Mode:</span>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "summary" | "detailed")}>
          <ToggleGroupItem value="summary" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Summary
          </ToggleGroupItem>
          <ToggleGroupItem value="detailed" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Detailed
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Detection Canvas and List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === "summary" ? "Grouped Detection View" : "Detailed Detection View"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DetectionCanvas
                imageUrl={imageUrl}
                detections={detections}
                width={width}
                height={height}
                viewMode={viewMode}
              />
            </CardContent>
          </Card>
        </div>

        {/* Detection List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Detection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto space-y-3">
              {detections.map((detection, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedDetection === index
                      ? "bg-primary/10 border-primary"
                      : "bg-card hover:bg-accent/50"
                  }`}
                  onClick={() => setSelectedDetection(selectedDetection === index ? null : index)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: getDetectionColor(detection.label) }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {detection.label}
                      </div>
                      {detection.item_description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {detection.item_description}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {Math.round(detection.confidence * 100)}%
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Position: ({Math.round(detection.bounding_box[0] * 100)}%, {Math.round(detection.bounding_box[1] * 100)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {detections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No plastic items detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetectionDisplay;