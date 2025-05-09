
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { List, Table as TableIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Detection {
  id: string;
  plasticType: string;
  detectedItems: string[];
  confidence: number;
  timestamp: Date;
  nonPlasticDetected?: boolean;
}

export default function DetectionHistory() {
  const { currentUser } = useAuth();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  useEffect(() => {
    async function fetchDetections() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "detections"),
          where("userId", "==", currentUser.uid),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const detectionsData: Detection[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          detectionsData.push({
            id: doc.id,
            plasticType: data.plasticType || "Unknown",
            detectedItems: data.detectedItems || [],
            confidence: data.confidence || 0,
            timestamp: data.timestamp?.toDate() || new Date(),
            nonPlasticDetected: data.nonPlasticDetected || false,
          });
        });

        setDetections(detectionsData);
      } catch (error) {
        toast.error("Failed to load detection history. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchDetections();
  }, [currentUser]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-40 flex items-center justify-center">
            <p>Loading detection history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-40 flex items-center justify-center flex-col gap-2">
            <p>Please log in to view your detection history.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (detections.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-40 flex items-center justify-center flex-col gap-2">
            <p>No detection history found.</p>
            <p className="text-sm text-muted-foreground">
              Start scanning plastic items to build your history.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Detection History</h2>
        <div className="flex items-center gap-2 border rounded-md p-1">
          <Toggle 
            pressed={viewMode === 'list'} 
            onPressedChange={() => setViewMode('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle 
            pressed={viewMode === 'table'} 
            onPressedChange={() => setViewMode('table')}
            aria-label="Table view"
          >
            <TableIcon className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detections.map((detection) => (
            <Card key={detection.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 p-4">
                <CardTitle className="text-lg flex justify-between">
                  <span>{detection.plasticType}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="mb-2">
                  {detection.detectedItems.length > 0 
                    ? `Detected Items: ${detection.detectedItems.join(", ")}` 
                    : detection.nonPlasticDetected 
                      ? "Non-plastic items detected" 
                      : "No items detected"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Confidence: {(detection.confidence * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plastic Type</TableHead>
                  <TableHead>Detected Items</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detections.map((detection) => (
                  <TableRow key={detection.id}>
                    <TableCell className="font-medium">{detection.plasticType}</TableCell>
                    <TableCell>
                      {detection.detectedItems.length > 0 
                        ? detection.detectedItems.join(", ") 
                        : detection.nonPlasticDetected 
                          ? "Non-plastic items" 
                          : "No items detected"}
                    </TableCell>
                    <TableCell>{(detection.confidence * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
