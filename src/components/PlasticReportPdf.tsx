
import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import { PlasticDetection } from "@/services/geminiService";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f1f7ed",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E8B57",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  summary: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#f9fff0",
    borderRadius: 5,
    borderLeft: "4 solid #3CB371",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2E8B57",
  },
  summaryText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 5,
  },
  detectionSection: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#3CB371",
    color: "white",
    padding: 5,
    borderRadius: 3,
  },
  detectionItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderLeft: "3 solid #3CB371",
  },
  plasticName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E4D6B",
  },
  confidenceBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 5,
    backgroundColor: "#e0e0e0",
  },
  confidenceFill: {
    height: "100%",
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: "#666",
  },
  infoSection: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#f0f9ff",
    borderRadius: 5,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4682B4",
  },
  infoText: {
    fontSize: 12,
    color: "#444",
    marginBottom: 3,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 10,
    color: "#999",
    borderTop: "1 solid #eee",
    paddingTop: 10,
  },
  nonPlasticNotice: {
    marginVertical: 10,
    padding: 8,
    backgroundColor: "#fff9e6",
    borderRadius: 5,
    borderLeft: "3 solid #f4d03f",
  },
  nonPlasticText: {
    fontSize: 13,
    color: "#7D6608",
  },
  plasticInfoBox: {
    marginTop: 5,
    padding: 5,
    backgroundColor: "#f0f8ff",
    borderRadius: 3,
  },
  plasticInfoText: {
    fontSize: 10,
    color: "#333",
  },
});

// Helper function for plastic type descriptions
const getPlasticInfo = (plasticType: string): string => {
  const plasticInfo: Record<string, string> = {
    "PET": "Polyethylene terephthalate. Commonly used in beverage bottles. Recyclable in most programs.",
    "HDPE": "High-density polyethylene. Found in milk jugs, detergent bottles. Widely recyclable.",
    "PVC": "Polyvinyl chloride. Used in pipes, medical equipment. Limited recyclability.",
    "LDPE": "Low-density polyethylene. Used in plastic bags, food wrap. Increasingly recyclable.",
    "PP": "Polypropylene. Used in yogurt containers, bottle caps. Moderately recyclable.",
    "PS": "Polystyrene. Used in foam cups, packaging. Difficult to recycle.",
    "Other": "Various other plastic types or composites. Limited recyclability.",
  };

  // Try to match the plastic type to our database
  for (const key of Object.keys(plasticInfo)) {
    if (plasticType.toUpperCase().includes(key)) {
      return plasticInfo[key];
    }
  }
  
  return "Additional information not available for this plastic type.";
};

interface PlasticReportPdfProps {
  detections: PlasticDetection[];
  nonPlasticDetected: boolean;
  captureDate: Date;
}

const PlasticReportPdf = ({ detections, nonPlasticDetected, captureDate }: PlasticReportPdfProps) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(captureDate);

  const uniquePlasticTypes = Array.from(new Set(detections.map(d => d.label)));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Plastic Detection Report</Text>
            <Text style={styles.subtitle}>PlasticDetect AI Analysis</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Detection Summary</Text>
          <Text style={styles.summaryText}>Total plastic items detected: {detections.length}</Text>
          <Text style={styles.summaryText}>Unique plastic types: {uniquePlasticTypes.length}</Text>
          <Text style={styles.summaryText}>Non-plastic materials: {nonPlasticDetected ? "Present" : "None detected"}</Text>
        </View>

        {/* Plastic Detections */}
        {detections.length > 0 && (
          <View style={styles.detectionSection}>
            <Text style={styles.sectionTitle}>Detailed Plastic Analysis</Text>
            {detections.map((detection, index) => {
              const confidencePercentage = Math.round(detection.confidence * 100);
              return (
                <View key={index} style={styles.detectionItem}>
                  <Text style={styles.plasticName}>{detection.label}</Text>
                  {/* Confidence bar */}
                  <View style={styles.confidenceBar}>
                    <View 
                      style={[
                        styles.confidenceFill, 
                        { 
                          width: `${confidencePercentage}%`, 
                          backgroundColor: confidencePercentage > 80 ? "#3CB371" : confidencePercentage > 50 ? "#F4D03F" : "#E74C3C" 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.confidenceText}>Confidence: {confidencePercentage}%</Text>
                  
                  {/* Plastic information box */}
                  <View style={styles.plasticInfoBox}>
                    <Text style={styles.plasticInfoText}>{getPlasticInfo(detection.label)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Non-plastic notice if applicable */}
        {nonPlasticDetected && (
          <View style={styles.nonPlasticNotice}>
            <Text style={styles.nonPlasticText}>
              Non-plastic materials were detected in the analysis. These items are not included in the detailed analysis above.
            </Text>
          </View>
        )}

        {/* Recycling Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Recycling Guidelines</Text>
          <Text style={styles.infoText}>• Clean and dry containers before recycling</Text>
          <Text style={styles.infoText}>• Check local recycling guidelines as they vary by location</Text>
          <Text style={styles.infoText}>• Remove caps and lids if required by your local program</Text>
          <Text style={styles.infoText}>• Compact items to save space in recycling bins</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated by PlasticDetect AI • Helping identify and classify plastic waste for better recycling</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PlasticReportPdf;