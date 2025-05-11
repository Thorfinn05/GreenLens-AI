// import { useState, useEffect } from "react";
// import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useAuth } from "@/contexts/AuthContext";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
// import { Toggle } from "@/components/ui/toggle";
// import { List, Table as TableIcon, X } from "lucide-react";
// import { Button } from "@/components/ui/button"; // Import the Button component
// import { formatDistanceToNow } from "date-fns";
// import { toast } from "sonner";
// import PdfDownloadButton from "@/components/PdfDownloadButton"; // Import the PDF download button

// interface Detection {
//   id: string;
//   plasticType: string;
//   detectedItems: string[];
//   confidence: number;
//   timestamp: Date;
//   nonPlasticDetected?: boolean;
//   imageDataBase64?: string;
// }

// export default function DetectionHistory() {
//   const { currentUser } = useAuth();
//   const [detections, setDetections] = useState<Detection[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
//   const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

//   useEffect(() => {
//     async function fetchDetections() {
//       if (!currentUser) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const q = query(
//           collection(db, "detections"),
//           where("userId", "==", currentUser.uid),
//           orderBy("timestamp", "desc")
//         );

//         const querySnapshot = await getDocs(q);
//         const detectionsData: Detection[] = [];

//         for (const doc of querySnapshot.docs) {
//           const data = doc.data();
//           detectionsData.push({
//             id: doc.id,
//             plasticType: data.plasticType || "Unknown",
//             detectedItems: data.detectedItems || [],
//             confidence: data.confidence || 0,
//             timestamp: data.timestamp?.toDate() || new Date(),
//             nonPlasticDetected: data.nonPlasticDetected || false,
//             imageDataBase64: data.imageDataBase64,
//           });
//         }

//         setDetections(detectionsData);
//       } catch (error) {
//         toast.error("Failed to load detection history. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDetections();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <div className="h-40 flex items-center justify-center">
//             <p>Loading detection history...</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <div className="h-40 flex items-center justify-center flex-col gap-2">
//             <p>Please log in to view your detection history.</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (detections.length === 0) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <div className="h-40 flex items-center justify-center flex-col gap-2">
//             <p>No detection history found.</p>
//             <p className="text-sm text-muted-foreground">
//               Start scanning plastic items to build your history.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   const handleDetectionClick = (detection: Detection) => {
//     setSelectedDetection(detection);
//   };

//   const handleCloseDetailedView = () => {
//     setSelectedDetection(null);
//   };

//   return (
//     <div className="space-y-4">
//       {selectedDetection && (
//         <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full md:w-3/4 lg:w-1/2 shadow-xl border">
//           <CardHeader className="flex justify-between items-center">
//             <CardTitle>Detailed Detection</CardTitle>
//             <Button variant="ghost" onClick={handleCloseDetailedView}>
//               <X className="h-4 w-4" />
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {selectedDetection.imageDataBase64 && (
//               <div className="border rounded overflow-hidden">
//                 <img
//                   src={selectedDetection.imageDataBase64}
//                   alt="Detailed Detection Image"
//                   className="w-full h-auto object-cover"
//                 />
//               </div>
//             )}
//             <p><strong>Plastic Type:</strong> {selectedDetection.plasticType}</p>
//             <p><strong>Detected Items:</strong> {selectedDetection.detectedItems.join(", ")}</p>
//             <p><strong>Confidence:</strong> {(selectedDetection.confidence * 100).toFixed(1)}%</p>
//             <p><strong>Date & Time:</strong> {formatDistanceToNow(selectedDetection.timestamp, { addSuffix: true })}</p>
//             <div className="mt-4">
//               <PdfDownloadButton
//                 detections={[{
//                   label: selectedDetection.plasticType,
//                   confidence: selectedDetection.confidence,
//                   bounding_box: [0, 0, 1, 1], // Placeholder for bounding box as it might not be relevant here
//                 }]}
//                 nonPlasticDetected={selectedDetection.nonPlasticDetected || false}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Your Detection History</h2>
//         <div className="flex items-center gap-2 border rounded-md p-1">
//           <Toggle
//             pressed={viewMode === 'list'}
//             onPressedChange={() => setViewMode('list')}
//             aria-label="List view"
//           >
//             <List className="h-4 w-4" />
//           </Toggle>
//           <Toggle
//             pressed={viewMode === 'table'}
//             onPressedChange={() => setViewMode('table')}
//             aria-label="Table view"
//           >
//             <TableIcon className="h-4 w-4" />
//           </Toggle>
//         </div>
//       </div>

//       {viewMode === 'list' ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {detections.map((detection) => (
//             <Card
//               key={detection.id}
//               className="overflow-hidden cursor-pointer"
//               onClick={() => handleDetectionClick(detection)}
//             >
//               <CardHeader className="bg-muted/50 p-4">
//                 <CardTitle className="text-lg flex justify-between">
//                   <span>{detection.plasticType}</span>
//                   <span className="text-sm font-normal text-muted-foreground">
//                     {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
//                   </span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-4">
//                 {detection.imageDataBase64 && (
//                   <div className="mb-3 border rounded overflow-hidden">
//                     <img
//                       src={detection.imageDataBase64}
//                       alt="Analyzed Detection"
//                       className="w-full h-auto object-cover"
//                     />
//                   </div>
//                 )}
//                 <p className="mb-2">
//                   {detection.detectedItems.length > 0
//                     ? `Detected Items: ${detection.detectedItems.join(", ")}`
//                     : detection.nonPlasticDetected
//                       ? "Non-plastic items detected"
//                       : "No items detected"}
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Confidence: {(detection.confidence * 100).toFixed(1)}%
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <Card>
//           <CardContent className="p-0 overflow-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Image</TableHead>
//                   <TableHead>Plastic Type</TableHead>
//                   <TableHead>Detected Items</TableHead>
//                   <TableHead>Confidence</TableHead>
//                   <TableHead>Date & Time</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {detections.map((detection) => (
//                   <TableRow
//                     key={detection.id}
//                     className="cursor-pointer hover:bg-muted/20"
//                     onClick={() => handleDetectionClick(detection)}
//                   >
//                     <TableCell>
//                       {detection.imageDataBase64 ? (
//                         <div className="w-16 h-16 relative rounded overflow-hidden">
//                           <img
//                             src={detection.imageDataBase64}
//                             alt="Analyzed Detection"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-muted-foreground text-sm">No image</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="font-medium">{detection.plasticType}</TableCell>
//                     <TableCell>
//                       {detection.detectedItems.length > 0
//                         ? detection.detectedItems.join(", ")
//                         : detection.nonPlasticDetected
//                           ? "Non-plastic items"
//                           : "No items detected"}
//                     </TableCell>
//                     <TableCell>{(detection.confidence * 100).toFixed(1)}%</TableCell>
//                     <TableCell>
//                       {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { List, Table as TableIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import { useToast } from "@/hooks/use-toast";

interface Detection {
  id: string;
  plasticType: string;
  detectedItems: string[];
  confidence: number;
  timestamp: Date;
  nonPlasticDetected?: boolean;
  imageDataBase64?: string;
  userId: string;
}

interface DetectionHistoryProps {
  userId?: string;
}

export default function DetectionHistory({ userId }: DetectionHistoryProps) {
  const { currentUser } = useAuth();
  const { toast: uiToast } = useToast();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  useEffect(() => {
    async function fetchDetections() {
      const targetUserId = userId || currentUser?.uid;
      
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        // Query the detections collection for the specified user
        const q = query(
          collection(db, "detections"),
          where("userId", "==", targetUserId),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const detectionsData: Detection[] = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          detectionsData.push({
            id: doc.id,
            plasticType: data.plasticType || "Unknown",
            detectedItems: data.detectedItems || [],
            confidence: data.confidence || 0,
            timestamp: data.timestamp?.toDate() || new Date(),
            nonPlasticDetected: data.nonPlasticDetected || false,
            imageDataBase64: data.imageDataBase64,
            userId: data.userId
          });
        }

        setDetections(detectionsData);
        
        // If no real detections exist yet and this is the current user, we could show demo data
        // But based on your request, we'll avoid this now
      } catch (error) {
        console.error("Error fetching detections:", error);
        uiToast({
          title: "Error loading detections",
          description: "There was a problem fetching the detection history.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDetections();
  }, [userId, currentUser, uiToast]);

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

  if (!currentUser && !userId) {
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

  const handleDetectionClick = (detection: Detection) => {
    setSelectedDetection(detection);
  };

  const handleCloseDetailedView = () => {
    setSelectedDetection(null);
  };

  return (
    <div className="space-y-4">
      {selectedDetection && (
        <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full md:w-3/4 lg:w-1/2 shadow-xl border">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Detailed Detection</CardTitle>
            <Button variant="ghost" onClick={handleCloseDetailedView}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDetection.imageDataBase64 && (
              <div className="border rounded overflow-hidden">
                <img
                  src={selectedDetection.imageDataBase64}
                  alt="Detailed Detection Image"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <p><strong>Plastic Type:</strong> {selectedDetection.plasticType}</p>
            <p><strong>Detected Items:</strong> {selectedDetection.detectedItems.join(", ")}</p>
            <p><strong>Confidence:</strong> {(selectedDetection.confidence * 100).toFixed(1)}%</p>
            <p><strong>Date & Time:</strong> {formatDistanceToNow(selectedDetection.timestamp, { addSuffix: true })}</p>
            <div className="mt-4">
              <PdfDownloadButton
                detections={[{
                  label: selectedDetection.plasticType,
                  confidence: selectedDetection.confidence,
                  bounding_box: [0, 0, 1, 1], // Placeholder for bounding box
                }]}
                nonPlasticDetected={selectedDetection.nonPlasticDetected || false}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Detection History</h2>
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
            <Card
              key={detection.id}
              className="overflow-hidden cursor-pointer"
              onClick={() => handleDetectionClick(detection)}
            >
              <CardHeader className="bg-muted/50 p-4">
                <CardTitle className="text-lg flex justify-between">
                  <span>{detection.plasticType}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {detection.imageDataBase64 && (
                  <div className="mb-3 border rounded overflow-hidden">
                    <img
                      src={detection.imageDataBase64}
                      alt="Analyzed Detection"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
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
                  <TableHead>Image</TableHead>
                  <TableHead>Plastic Type</TableHead>
                  <TableHead>Detected Items</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detections.map((detection) => (
                  <TableRow
                    key={detection.id}
                    className="cursor-pointer hover:bg-muted/20"
                    onClick={() => handleDetectionClick(detection)}
                  >
                    <TableCell>
                      {detection.imageDataBase64 ? (
                        <div className="w-16 h-16 relative rounded overflow-hidden">
                          <img
                            src={detection.imageDataBase64}
                            alt="Analyzed Detection"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No image</span>
                      )}
                    </TableCell>
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


// FROM HEREEEEEEEEEEEEEEEEEEEEEEEEE
// import { useState, useEffect } from "react";
// import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useAuth } from "@/contexts/AuthContext";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
// import { Toggle } from "@/components/ui/toggle";
// import { List, Table as TableIcon } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { toast } from "sonner";

// interface Detection {
//   id: string;
//   plasticType: string;
//   detectedItems: string[];
//   confidence: number;
//   timestamp: Date;
//   nonPlasticDetected?: boolean;
//   imageDataBase64?: string; // To store the Base64 encoded analyzed image
// }

// export default function DetectionHistory() {
//   const { currentUser } = useAuth();
//   const [detections, setDetections] = useState<Detection[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

//   useEffect(() => {
//     async function fetchDetections() {
//       if (!currentUser) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const q = query(
//           collection(db, "detections"),
//           where("userId", "==", currentUser.uid),
//           orderBy("timestamp", "desc")
//         );

//         const querySnapshot = await getDocs(q);
//         const detectionsData: Detection[] = [];

//         for (const doc of querySnapshot.docs) {
//           const data = doc.data();
//           detectionsData.push({
//             id: doc.id,
//             plasticType: data.plasticType || "Unknown",
//             detectedItems: data.detectedItems || [],
//             confidence: data.confidence || 0,
//             timestamp: data.timestamp?.toDate() || new Date(),
//             nonPlasticDetected: data.nonPlasticDetected || false,
//             imageDataBase64: data.imageDataBase64, // Retrieve the Base64 image data
//           });
//         }

//         setDetections(detectionsData);
//       } catch (error) {
//         toast.error("Failed to load detection history. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDetections();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <div className="h-40 flex items-center justify-center">
//             <p>Loading detection history...</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <div className="h-40 flex items-center justify-center flex-col gap-2">
//             <p>Please log in to view your detection history.</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (detections.length === 0) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <div className="h-40 flex items-center justify-center flex-col gap-2">
//             <p>No detection history found.</p>
//             <p className="text-sm text-muted-foreground">
//               Start scanning plastic items to build your history.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Your Detection History</h2>
//         <div className="flex items-center gap-2 border rounded-md p-1">
//           <Toggle
//             pressed={viewMode === 'list'}
//             onPressedChange={() => setViewMode('list')}
//             aria-label="List view"
//           >
//             <List className="h-4 w-4" />
//           </Toggle>
//           <Toggle
//             pressed={viewMode === 'table'}
//             onPressedChange={() => setViewMode('table')}
//             aria-label="Table view"
//           >
//             <TableIcon className="h-4 w-4" />
//           </Toggle>
//         </div>
//       </div>

//       {viewMode === 'list' ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {detections.map((detection) => (
//             <Card key={detection.id} className="overflow-hidden">
//               <CardHeader className="bg-muted/50 p-4">
//                 <CardTitle className="text-lg flex justify-between">
//                   <span>{detection.plasticType}</span>
//                   <span className="text-sm font-normal text-muted-foreground">
//                     {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
//                   </span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-4">
//                 {detection.imageDataBase64 && (
//                   <div className="mb-3 border rounded overflow-hidden">
//                     <img
//                       src={detection.imageDataBase64}
//                       alt="Analyzed Detection"
//                       className="w-full h-auto object-cover"
//                     />
//                   </div>
//                 )}
//                 <p className="mb-2">
//                   {detection.detectedItems.length > 0
//                     ? `Detected Items: ${detection.detectedItems.join(", ")}`
//                     : detection.nonPlasticDetected
//                       ? "Non-plastic items detected"
//                       : "No items detected"}
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Confidence: {(detection.confidence * 100).toFixed(1)}%
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <Card>
//           <CardContent className="p-0 overflow-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Image</TableHead>
//                   <TableHead>Plastic Type</TableHead>
//                   <TableHead>Detected Items</TableHead>
//                   <TableHead>Confidence</TableHead>
//                   <TableHead>Date & Time</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {detections.map((detection) => (
//                   <TableRow key={detection.id}>
//                     <TableCell>
//                       {detection.imageDataBase64 ? (
//                         <div className="w-16 h-16 relative rounded overflow-hidden">
//                           <img
//                             src={detection.imageDataBase64}
//                             alt="Analyzed Detection"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-muted-foreground text-sm">No image</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="font-medium">{detection.plasticType}</TableCell>
//                     <TableCell>
//                       {detection.detectedItems.length > 0
//                         ? detection.detectedItems.join(", ")
//                         : detection.nonPlasticDetected
//                           ? "Non-plastic items"
//                           : "No items detected"}
//                     </TableCell>
//                     <TableCell>{(detection.confidence * 100).toFixed(1)}%</TableCell>
//                     <TableCell>
//                       {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }