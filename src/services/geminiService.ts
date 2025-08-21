
// import { toast } from "sonner";

// export interface PlasticDetection {
//   label: string;
//   confidence: number;
//   bounding_box: [number, number, number, number]; // [x1, y1, x2, y2]
//   item_description?: string; // New field to store object description
// }

// export interface AnalysisResult {
//   annotatedImageUrl: string | null;
//   detections: PlasticDetection[];
//   non_plastic_detected?: boolean; // Flag to indicate if non-plastic items were detected
// }

// const API_KEY = "AIzaSyAXWXkW7c0HFZP70ujgrzzSGEb6oBf7JYE";

// export const analyzeImage = async (
//   imageFile: File
// ): Promise<AnalysisResult> => {
//   try {
//     // Convert the image to base64
//     const base64Image = await fileToBase64(imageFile);

//     // Create the Gemini API request - using gemini-1.5-pro for better accuracy
//     const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-goog-api-key": API_KEY
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `Task: Analyze this image containing mixed wastes and detect plastic items with high precision.

// Instructions:
// 1. Identify ONLY plastic objects in the image (bottles, containers, bags, wrappers, etc.)
// 2. Be very accurate in classifying each plastic item into one of these categories: PET, HDPE, PVC, LDPE, PP, PS, or Others
// 3. For each detected plastic object, provide:
//    - The most precise plastic type label possible (e.g., PET, HDPE)
//    - A specific and detailed item description (e.g., "clear water bottle", "white shampoo container")
//    - A confidence score between 0 and 1
//    - A bounding box in the format [x1, y1, x2, y2] where x1,y1 is the top-left corner and x2,y2 is the bottom-right corner, with all values as floating points between 0 and 1
//    - Make the bounding boxes VERY PRECISE and TIGHT around the actual plastic objects
   
// 4. If you detect items that are definitely NOT plastic (paper, glass, metal, etc.), set a flag "non_plastic_detected" to true
// 5. Double-check your plastic type classifications to ensure they are accurate based on item appearance and common materials

// Return ONLY a valid JSON with this exact structure:
// {
//   "detections": [
//     {
//       "label": "PET",
//       "item_description": "water bottle",
//       "confidence": 0.92,
//       "bounding_box": [0.1, 0.2, 0.3, 0.4]
//     },
//     ...
//   ],
//   "non_plastic_detected": true/false
// }

// If no plastic items are detected, return {"detections": [], "non_plastic_detected": true/false}.
// Do not include any explanation or other text outside the JSON object.`
//               },
//               {
//                 inline_data: {
//                   mime_type: "image/jpeg",
//                   data: base64Image.split(",")[1]
//                 }
//               }
//             ]
//           }
//         ],
//         generation_config: {
//           temperature: 0.01, // Lower temperature for more precise outputs
//           top_p: 0.95,
//           top_k: 40,
//           max_output_tokens: 2048,
//         }
//       })
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Gemini API error:", errorText);
//       throw new Error(`API request failed: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
    
//     // Extract the JSON result from the response
//     let jsonText = "";
//     if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
//       jsonText = data.candidates[0].content.parts[0].text;
      
//       // Clean up the response in case there's text around the JSON
//       jsonText = jsonText.trim();
      
//       // Extract JSON if it's within markdown code blocks or text
//       const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
//                         jsonText.match(/\{[\s\S]*\}/);
      
//       if (jsonMatch) {
//         jsonText = jsonMatch[1] || jsonMatch[0];
//       }
//     }
    
//     let detections: PlasticDetection[] = [];
//     let non_plastic_detected = false;
    
//     try {
//       const parsedResult = JSON.parse(jsonText);
      
//       // Handle the new response format
//       if (parsedResult.detections) {
//         detections = parsedResult.detections.map((item: any) => ({
//           label: item.label || "Unknown",
//           confidence: typeof item.confidence === 'number' ? item.confidence : parseFloat(String(item.confidence)) || 0,
//           bounding_box: item.bounding_box || [0, 0, 0, 0],
//           item_description: item.item_description || undefined
//         }));
//         non_plastic_detected = !!parsedResult.non_plastic_detected;
//       } else if (Array.isArray(parsedResult)) {
//         // Handle old format for backward compatibility
//         detections = parsedResult.map((item: any) => ({
//           label: item.label || "Unknown",
//           confidence: typeof item.confidence === 'number' ? item.confidence : parseFloat(String(item.confidence)) || 0,
//           bounding_box: item.bounding_box || [0, 0, 0, 0],
//           item_description: item.item_description || undefined
//         }));
//       }
//     } catch (e) {
//       console.error("Failed to parse JSON response:", e);
//       console.log("Raw response:", jsonText);
//       toast.error("Failed to parse detection results from AI");
//       return { annotatedImageUrl: null, detections: [], non_plastic_detected: false };
//     }

//     // Return the detection results
//     return { 
//       annotatedImageUrl: null, 
//       detections,
//       non_plastic_detected
//     };
//   } catch (error) {
//     console.error("Error analyzing image:", error);
//     toast.error("Failed to analyze image");
//     return { annotatedImageUrl: null, detections: [], non_plastic_detected: false };
//   }
// };

// // Helper function to convert File to base64
// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = error => reject(error);
//   });
// };


// import { toast } from "sonner";

// export interface PlasticDetection {
//   label: string;
//   confidence: number;
//   bounding_box: [number, number, number, number]; // [x1, y1, x2, y2]
//   item_description?: string; // New field to store object description
// }

// export interface AnalysisResult {
//   annotatedImageUrl: string | null;
//   detections: PlasticDetection[];
//   non_plastic_detected?: boolean; // Flag to indicate if non-plastic items were detected
// }

// const API_KEY = "AIzaSyA877spYthAV1komvQY6b3mkeIbEHg_j4w";

// export const analyzeImage = async (
//   imageFile: File
// ): Promise<AnalysisResult> => {
//   try {
//     // Convert the image to base64
//     const base64Image = await fileToBase64(imageFile);

//     // Create the Gemini API request - using gemini-1.5-pro for better accuracy
//     const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-goog-api-key": API_KEY
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `Task: Analyze this image containing mixed wastes and detect plastic items with high precision.

// Instructions:
// 1. Identify ONLY plastic objects in the image (bottles, containers, bags, wrappers, etc.)
// 2. Be very accurate in classifying each plastic item into one of these categories: PET, HDPE, PVC, LDPE, PP, PS, or Others
// 3. For each detected plastic object, provide:
//    - The most precise plastic type label possible (e.g., PET, HDPE)
//    - A specific and detailed item description (e.g., "clear water bottle", "white shampoo container")
//    - A confidence score between 0 and 1
//    - A bounding box in the format [x1, y1, x2, y2] where x1,y1 is the top-left corner and x2,y2 is the bottom-right corner, with all values as floating points between 0 and 1
//    - Make the bounding boxes VERY PRECISE and TIGHT around the actual plastic objects
   
// 4. If you detect items that are definitely NOT plastic (paper, glass, metal, etc.), set a flag "non_plastic_detected" to true
// 5. Double-check your plastic type classifications to ensure they are accurate based on item appearance and common materials

// Return ONLY a valid JSON with this exact structure:
// {
//   "detections": [
//     {
//       "label": "PET",
//       "item_description": "water bottle",
//       "confidence": 0.92,
//       "bounding_box": [0.1, 0.2, 0.3, 0.4]
//     },
//     ...
//   ],
//   "non_plastic_detected": true/false
// }

// If no plastic items are detected, return {"detections": [], "non_plastic_detected": true/false}.
// Do not include any explanation or other text outside the JSON object.`
//               },
//               {
//                 inline_data: {
//                   mime_type: "image/jpeg",
//                   data: base64Image.split(",")[1]
//                 }
//               }
//             ]
//           }
//         ],
//         generation_config: {
//           temperature: 0.01, // Lower temperature for more precise outputs
//           top_p: 0.95,
//           top_k: 40,
//           max_output_tokens: 2048,
//         }
//       })
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Gemini API error:", errorText);
//       throw new Error(`API request failed: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
    
//     // Extract the JSON result from the response
//     let jsonText = "";
//     if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
//       jsonText = data.candidates[0].content.parts[0].text;
      
//       // Clean up the response in case there's text around the JSON
//       jsonText = jsonText.trim();
      
//       // Extract JSON if it's within markdown code blocks or text
//       const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
//                         jsonText.match(/\{[\s\S]*\}/);
      
//       if (jsonMatch) {
//         jsonText = jsonMatch[1] || jsonMatch[0];
//       }
//     }
    
//     let detections: PlasticDetection[] = [];
//     let non_plastic_detected = false;
    
//     try {
//       const parsedResult = JSON.parse(jsonText);
      
//       // Handle the new response format
//       if (parsedResult.detections) {
//         detections = parsedResult.detections.map((item: { label: string; confidence: number; bounding_box: [number, number, number, number]; item_description?: string }) => ({
//           label: item.label || "Unknown",
//           confidence: typeof item.confidence === 'number' ? item.confidence : parseFloat(String(item.confidence)) || 0,
//           bounding_box: item.bounding_box || [0, 0, 0, 0],
//           item_description: item.item_description || undefined
//         }));
//         non_plastic_detected = !!parsedResult.non_plastic_detected;
//       } else if (Array.isArray(parsedResult)) {
//         // Handle old format for backward compatibility
//         detections = parsedResult.map((item: { label: string; confidence: number; bounding_box: [number, number, number, number]; item_description?: string }) => ({
//           label: item.label || "Unknown",
//           confidence: typeof item.confidence === 'number' ? item.confidence : parseFloat(String(item.confidence)) || 0,
//           bounding_box: item.bounding_box || [0, 0, 0, 0],
//           item_description: item.item_description || undefined
//         }));
//       }
//     } catch (e) {
//       console.error("Failed to parse JSON response:", e);
//       console.log("Raw response:", jsonText);
//       toast.error("Failed to parse detection results from AI");
//       return { annotatedImageUrl: null, detections: [], non_plastic_detected: false };
//     }

//     // Return the detection results
//     return { 
//       annotatedImageUrl: null, 
//       detections,
//       non_plastic_detected
//     };
//   } catch (error) {
//     console.error("Error analyzing image:", error);
//     toast.error("Failed to analyze image");
//     return { annotatedImageUrl: null, detections: [], non_plastic_detected: false };
//   }
// };

// // Helper function to convert File to base64
// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = error => reject(error);
//   });
// };

import { toast } from "sonner";

export interface PlasticDetection {
  label: string;
  confidence: number;
  bounding_box: [number, number, number, number]; // [x1, y1, x2, y2]
  item_description?: string; // New field to store object description
}

export interface AnalysisResult {
  annotatedImageUrl: string | null;
  detections: PlasticDetection[];
  non_plastic_detected?: boolean; // Flag to indicate if non-plastic items were detected
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


const MAX_RETRIES = 3;
const INITIAL_BACKOFF_DELAY = 1000; // 1 second

export const analyzeImage = async (
  imageFile: File
): Promise<AnalysisResult> => {
  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount < MAX_RETRIES) {
    try {
      // Convert the image to base64
      const base64Image = await fileToBase64(imageFile);

      // Create the Gemini API request - using gemini-2.5-flash-preview-04-17 for better accuracy
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Task: Analyze this image containing mixed wastes and detect plastic items with high precision.

Instructions:
1. Identify ONLY plastic objects in the image (bottles, containers, bags, wrappers, etc.)
2. Be very accurate in classifying each plastic item into one of these categories: PET, HDPE, PVC, LDPE, PP, PS, or Others
3. For each detected plastic object, provide:
    - The most precise plastic type label possible (e.g., PET, HDPE)
    - A specific and detailed item description (e.g., "clear water bottle", "white shampoo container")
    - A confidence score between 0 and 1
    - A bounding box in the format [x1, y1, x2, y2] where x1,y1 is the top-left corner and x2,y2 is the bottom-right corner, with all values as floating points between 0 and 1
    - Make the bounding boxes VERY PRECISE and TIGHT around the actual plastic objects

4. If you detect items that are definitely NOT plastic (paper, glass, metal, etc.), set a flag "non_plastic_detected" to true
5. Double-check your plastic type classifications to ensure they are accurate based on item appearance and common materials

Return ONLY a valid JSON with this exact structure:
{
  "detections": [
    {
      "label": "PET",
      "item_description": "water bottle",
      "confidence": 0.92,
      "bounding_box": [0.1, 0.2, 0.3, 0.4]
    },
    ...
  ],
  "non_plastic_detected": true/false
}

If no plastic items are detected, return {"detections": [], "non_plastic_detected": true/false}.
Do not include any explanation or other text outside the JSON object.`
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image.split(",")[1]
                  }
                }
              ]
            }
          ],
          generation_config: {
            temperature: 0.01, // Lower temperature for more precise outputs
            top_p: 0.95,
            top_k: 40,
            max_output_tokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (attempt ${retryCount + 1}):`, errorText);
        lastError = new Error(`API request failed: ${response.status} ${response.statusText}`);
        // Implement exponential backoff
        const delay = INITIAL_BACKOFF_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
        continue; // Go to the next iteration of the while loop
      }

      const data = await response.json();

      // Extract the JSON result from the response
      let jsonText = "";
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        jsonText = data.candidates[0].content.parts[0].text;

        // Clean up the response in case there's text around the JSON
        jsonText = jsonText.trim();

        // Extract JSON if it's within markdown code blocks or text
        const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
                          jsonText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          jsonText = jsonMatch[1] || jsonMatch[0];
        }
      }

      let detections: PlasticDetection[] = [];
      let non_plastic_detected = false;

      try {
        const parsedResult = JSON.parse(jsonText);

        // Handle the new response format
        if (parsedResult.detections) {
          detections = parsedResult.detections.map((item: { label: string; confidence: number; bounding_box: [number, number, number, number]; item_description?: string }) => ({
            label: item.label || "Unknown",
            confidence: typeof item.confidence === 'number' ? item.confidence : parseFloat(String(item.confidence)) || 0,
            bounding_box: item.bounding_box || [0, 0, 0, 0],
            item_description: item.item_description || undefined
          }));
          non_plastic_detected = !!parsedResult.non_plastic_detected;
        } else if (Array.isArray(parsedResult)) {
          // Handle old format for backward compatibility
          detections = parsedResult.map((item: { label: string; confidence: number; bounding_box: [number, number, number, number]; item_description?: string }) => ({
            label: item.label || "Unknown",
            confidence: typeof item.confidence === 'number' ? item.confidence : parseFloat(String(item.confidence)) || 0,
            bounding_box: item.bounding_box || [0, 0, 0, 0],
            item_description: item.item_description || undefined
          }));
        }
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.log("Raw response:", jsonText);
        toast.error("Failed to parse detection results from AI");
        return { annotatedImageUrl: null, detections: [], non_plastic_detected: false };
      }

      // If the request was successful, return the result
      return {
        annotatedImageUrl: null,
        detections,
        non_plastic_detected
      };

    } catch (error) {
      console.error("Error analyzing image:", error);
      lastError = error;
      // Implement exponential backoff
      const delay = INITIAL_BACKOFF_DELAY * Math.pow(2, retryCount);
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
    }
  }

  // If all retries failed, throw the last error or return a default result with an error toast
  toast.error(`Failed to analyze image after ${MAX_RETRIES} retries.`);
  return { annotatedImageUrl: null, detections: [], non_plastic_detected: false };
};

// Helper function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};


// import { toast } from "sonner";

// export interface PlasticDetection {
//   label: string;
//   confidence: number;
//   bounding_box: [number, number, number, number]; // [x1, y1, x2, y2]
//   item_description?: string; // New field to store object description
// }

// export interface AnalysisResult {
//   annotatedImageUrl: string | null;
//   detections: PlasticDetection[];
//   non_plastic_detected?: boolean; // Flag to indicate if non-plastic items were detected
// }

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


// const MAX_RETRIES = 3;
// const INITIAL_BACKOFF_DELAY = 1000; // 1 second

// export const analyzeImage = async (
//   imageFile: File
// ): Promise<AnalysisResult> => {
//   let retryCount = 0;
//   let lastError: Error | null = null;

//   while (retryCount < MAX_RETRIES) {
//     try {
//       // Convert the image to base64
//       const base64Image = await fileToBase64(imageFile);

//       // Create the Gemini API request - using gemini-2.5-flash-preview-04-17 for better accuracy
//       const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": API_KEY
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               role: "user",
//               parts: [
//                 {
//                   text: `Task: Analyze this image containing mixed wastes and detect plastic items with high precision.

// Instructions:
// 1. Identify ONLY plastic objects in the image (bottles, containers, bags, wrappers, etc.)
// 2. Be very accurate in classifying each plastic item into one of these categories: PET, HDPE, PVC, LDPE, PP, PS, or Others
// 3. For each detected plastic object, provide:
//     - The most precise plastic type label possible (e.g., PET, HDPE)
//     - A specific and detailed item description (e.g., "clear water bottle", "white shampoo container")
//     - A confidence score between 0 and 1
//     - A bounding box in the format [x1, y1, x2, y2] where x1,y1 is the top-left corner and x2,y2 is the bottom-right corner, with all values as floating points between 0 and 1
//     - Make the bounding boxes VERY PRECISE and TIGHT around the actual plastic objects

// 4. If you detect items that are definitely NOT plastic (paper, glass, metal, etc.), set a flag "non_plastic_detected" to true
// 5. Double-check your plastic type classifications to ensure they are accurate based on item appearance and common materials

// Return ONLY a valid JSON with this exact structure:
// {
//   "detections": [
//     {
//       "label": "PET",
//       "item_description": "water bottle",
//       "confidence": 0.92,
//       "bounding_box": [0.1, 0.2, 0.3, 0.4]
//     },
//     ...
//   ],
//   "non_plastic_detected": true/false
// }

// If no plastic items are detected, return {"detections": [], "non_plastic_detected": true/false}.
// Do not include any explanation or other text outside the JSON object.`
//                 },
//                 {
//                   inline_data: {
//                     mime_type: "image/jpeg",
//                     data: base64Image.split(",")[1]
//                   }
//                 }
//               ]
//             }
//           ],
//           generation_config: {
//             temperature: 0.01, // Lower temperature for more precise outputs
//             top_p: 0.95,
//             top_k: 40,
//             max_output_tokens: 3000,
//           }
//         })
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Gemini API error (attempt ${retryCount + 1}):`, errorText);
//         lastError = new Error(`API request failed: ${response.status} ${response.statusText}`);
//         // Implement exponential backoff
//         const delay = INITIAL_BACKOFF_DELAY * Math.pow(2, retryCount);
//         console.log(`Retrying in ${delay / 1000} seconds...`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//         retryCount++;
//         continue; // Go to the next iteration of the while loop
//       }

//       const data = await response.json();

//       // Extract the JSON result from the response
//       let jsonText = "";
//       if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
//         jsonText = data.candidates[0].content.parts[0].text;

//         // Clean up the response in case there's text around the JSON
//         jsonText = jsonText.trim();

//         // Extract JSON if it's within markdown code blocks or text
//         const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
//                           jsonText.match(/\{[\s\S]*\}/);

//         if (jsonMatch) {
//           jsonText = jsonMatch[1] || jsonMatch[0];
//         }
//       }

//       let detections: PlasticDetection[] = [];
//       let non_plastic_detected = false;

//       try {
//         const parsedResult = JSON.parse(jsonText);

//         // Handle the new response format
//         if (parsedResult.detections) {
//           detections = parsedResult.detections.map((item: { label: string; confidence: number; bounding_box: [number, number, number, number]; item_description?: string }) => ({
//             label: item.label || "Unknown",
//             confidence: typeof item.confidence === 'number' ? item.confidence : parseFloat(String(item.confidence)) || 0,
//             bounding_box: item.bounding_box || [0, 0, 0, 0],
//             item_description: item.item_description || undefined
//           }));
//           non_plastic_detected = !!parsedResult.non_plastic_detected;
//         } else if (Array.isArray(parsedResult)) {
//           // Handle old format for backward compatibility
//           detections = parsedResult.map((item: { label: string; confidence: number; bounding_box: [number, number, number, number]; item_description?: string }) => ({
//             label: item.label || "Unknown",
//             confidence: typeof item.confidence === 'number' ? item.confidence : parseFloat(String(item.confidence)) || 0,
//             bounding_box: item.bounding_box || [0, 0, 0, 0],
//             item_description: item.item_description || undefined
//           }));
//         }
//       } catch (e) {
//         console.error("Failed to parse JSON response:", e);
//         console.log("Raw response:", jsonText);
//         toast.error("Failed to parse detection results from AI");
//         return { annotatedImageUrl: null, detections: [], non_plastic_detected: false };
//       }

//       // If the request was successful, return the result
//       return {
//         annotatedImageUrl: null,
//         detections,
//         non_plastic_detected
//       };

//     } catch (error) {
//       console.error("Error analyzing image:", error);
//       lastError = error;
//       // Implement exponential backoff
//       const delay = INITIAL_BACKOFF_DELAY * Math.pow(2, retryCount);
//       console.log(`Retrying in ${delay / 1000} seconds...`);
//       await new Promise(resolve => setTimeout(resolve, delay));
//       retryCount++;
//     }
//   }

//   // If all retries failed, throw the last error or return a default result with an error toast
//   toast.error(`Failed to analyze image after ${MAX_RETRIES} retries.`);
//   return { annotatedImageUrl: null, detections: [], non_plastic_detected: false };
// };

// // Helper function to convert File to base64
// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = error => reject(error);
//   });
// };