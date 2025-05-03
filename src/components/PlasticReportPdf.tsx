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
  groupedDetectionItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderLeft: "3 solid #3CB371",
  },
  plasticName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E4D6B",
  },
  plasticTypeHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E4D6B",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "1 solid #BDE5F8",
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
  detectedItemsList: {
    marginTop: 8,
    marginLeft: 10,
  },
  detectedItem: {
    fontSize: 12,
    color: "#444",
    marginBottom: 4,
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
  detailsBox: {
    marginTop: 5,
    padding: 5,
    backgroundColor: "#f8f8ff",
    borderRadius: 3,
    borderLeft: "2 solid #9b87f5",
  },
  detailsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  detailsText: {
    fontSize: 9,
    color: "#555",
    lineHeight: 1.4,
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

// Helper function to get more detailed description based on plastic type
const getPlasticDetails = (plasticType: string): string => {
  const details: Record<string, string> = {
    "PET": "PET is one of the most widely recycled plastics worldwide. When recycled, it can be made into new bottles, clothing, carpet, and other products. Look for the triangle with number 1 inside for identification. Proper cleaning before recycling is essential.",
    "HDPE": "HDPE is considered one of the safest plastics for food and beverages. It can be recycled into playground equipment, plastic lumber, and new containers. Find the triangle with number 2 inside to identify HDPE products.",
    "PVC": "PVC contains chlorine and can leach harmful chemicals. It's difficult to recycle and often rejected by recycling programs. PVC products have a triangle with number 3 inside. Consider alternatives when possible.",
    "LDPE": "LDPE is frequently used in plastic bags and food packaging. It's increasingly accepted in recycling programs but check your local guidelines. Look for the triangle with number 4 inside to identify LDPE products.",
    "PP": "PP is considered safe for food contact and is commonly used in food containers. It can be recycled into items like brooms, trays and bins. PP products have a triangle with number 5 inside.",
    "PS": "PS or Styrofoam can be harmful to health when heated. It's rarely recycled due to its low weight-to-volume ratio. PS products have a triangle with number 6 inside. Consider avoiding when possible.",
    "Other": "This category includes all other plastics and multi-material items. These are typically difficult to recycle and often end up in landfills. Products in this category have a triangle with number 7 inside."
  };

  // Try to match the plastic type to our database
  for (const key of Object.keys(details)) {
    if (plasticType.toUpperCase().includes(key)) {
      return details[key];
    }
  }
  
  return "This appears to be a specialized or composite plastic type. These materials often have specific disposal requirements and limited recycling options. Check with local waste management authorities for proper disposal guidance.";
};

// Helper function for common plastic uses
const getCommonUses = (plasticType: string): string => {
  const uses: Record<string, string> = {
    "PET": "Beverage bottles, food containers, medicine jars, textile fibers",
    "HDPE": "Milk jugs, detergent bottles, toys, grocery bags, outdoor furniture",
    "PVC": "Pipes, window frames, wire insulation, medical equipment, credit cards",
    "LDPE": "Squeeze bottles, plastic bags, food wrap, flexible container lids",
    "PP": "Food containers, bottle caps, straws, medical equipment, auto parts",
    "PS": "Foam cups, disposable cutlery, packaging materials, insulation",
    "Other": "Water bottles, electronics, eyeglasses, specialty packaging",
  };

  // Try to match the plastic type to our database
  for (const key of Object.keys(uses)) {
    if (plasticType.toUpperCase().includes(key)) {
      return uses[key];
    }
  }
  
  return "Various specialized applications";
};

// Helper function to group detections by plastic type
const groupDetectionsByType = (detections: PlasticDetection[]) => {
  const groupedDetections: Record<string, PlasticDetection[]> = {};
  
  detections.forEach(detection => {
    // Use the plastic type as the key
    if (!groupedDetections[detection.label]) {
      groupedDetections[detection.label] = [];
    }
    groupedDetections[detection.label].push(detection);
  });
  
  return groupedDetections;
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
  const groupedDetections = groupDetectionsByType(detections);

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

        {/* Grouped Plastic Detections */}
        {detections.length > 0 && (
          <View style={styles.detectionSection}>
            <Text style={styles.sectionTitle}>Detailed Plastic Analysis</Text>
            
            {Object.entries(groupedDetections).map(([plasticType, items], index) => {
              // Calculate average confidence for the plastic type
              const avgConfidence = items.reduce((sum, item) => sum + item.confidence, 0) / items.length;
              const confidencePercentage = Math.round(avgConfidence * 100);
              
              return (
                <View key={index} style={styles.groupedDetectionItem}>
                  <Text style={styles.plasticTypeHeader}>{plasticType}</Text>
                  
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
                  <Text style={styles.confidenceText}>Average Confidence: {confidencePercentage}%</Text>
                  
                  {/* Detected items list */}
                  <Text style={styles.detailsTitle}>Detected Items:</Text>
                  <View style={styles.detectedItemsList}>
                    {items.map((item, i) => (
                      <Text key={i} style={styles.detectedItem}>
                        • Item {i+1}: {Math.round(item.confidence * 100)}% confidence
                      </Text>
                    ))}
                  </View>
                  
                  {/* Plastic information box */}
                  <View style={styles.plasticInfoBox}>
                    <Text style={styles.plasticInfoText}>{getPlasticInfo(plasticType)}</Text>
                  </View>
                  
                  {/* Common uses */}
                  <View style={styles.detailsBox}>
                    <Text style={styles.detailsTitle}>Common Uses:</Text>
                    <Text style={styles.detailsText}>{getCommonUses(plasticType)}</Text>
                  </View>
                  
                  {/* Extended details */}
                  <View style={styles.detailsBox}>
                    <Text style={styles.detailsTitle}>Detailed Information:</Text>
                    <Text style={styles.detailsText}>{getPlasticDetails(plasticType)}</Text>
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