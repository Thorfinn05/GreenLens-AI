
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlasticDetection } from "@/services/geminiService";
import { Copy, Check } from "lucide-react";

interface JsonViewProps {
  detections: PlasticDetection[];
}

const JsonView = ({ detections }: JsonViewProps) => {
  const [copied, setCopied] = useState(false);
  
  const jsonString = JSON.stringify(detections, null, 2);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">JSON Metadata</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={copyToClipboard}
          className="h-8"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-3 rounded-md overflow-auto max-h-[300px]">
          <pre className="text-xs">
            {jsonString}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonView;
