
import { useState } from "react";
import { Button } from "./ui/button";
import { Download, Loader2 } from "lucide-react";
import { PlasticDetection } from "@/services/geminiService";
import { pdf } from "@react-pdf/renderer";
import PlasticReportPdf from "./PlasticReportPdf";
import { toast } from "sonner";

interface PdfDownloadButtonProps {
  detections: PlasticDetection[];
  nonPlasticDetected: boolean;
  disabled?: boolean;
}

const PdfDownloadButton = ({ detections, nonPlasticDetected, disabled = false }: PdfDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAndDownloadPdf = async () => {
    if (disabled || isGenerating) return;
    
    setIsGenerating(true);
    toast.info("Generating PDF report...");
    
    try {
      const blob = await pdf(
        <PlasticReportPdf 
          detections={detections} 
          nonPlasticDetected={nonPlasticDetected} 
          captureDate={new Date()}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `plastic-detection-report-${new Date().toISOString().split("T")[0]}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generateAndDownloadPdf} 
      disabled={disabled || isGenerating || detections.length === 0}
      variant="outline"
      className="bg-eco-gradient text-white hover:shadow-eco-glow transition-all"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Download Detection Report
        </>
      )}
    </Button>
  );
};

export default PdfDownloadButton;