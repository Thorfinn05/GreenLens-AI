
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, ImageIcon, Loader2, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { toast } from "sonner";

export default function CreateChallenge() {
  const navigate = useNavigate();
  const { createChallenge } = useCommunity();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 7))
  );
  const [tips, setTips] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setImage(file);
      
  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
      if (file) {
        toast.error("Please select a .png or .jpg/.jpeg image file.");
      }
    }
  };

  const handleTipChange = (index: number, value: string) => {
    const updatedTips = [...tips];
    updatedTips[index] = value;
    setTips(updatedTips);
  };

  const addTip = () => {
    setTips([...tips, ""]);
  };

  const removeTip = (index: number) => {
    if (tips.length > 1) {
      const updatedTips = [...tips];
      updatedTips.splice(index, 1);
      setTips(updatedTips);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!title || !description || !hashtag || !startDate || !endDate) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   // Format hashtag correctly
  //   let formattedHashtag = hashtag;
  //   if (formattedHashtag.startsWith("#")) {
  //     formattedHashtag = formattedHashtag.substring(1);
  //   }

  //   // Filter out empty tips
  //   const filteredTips = tips.filter(tip => tip.trim() !== "");

  //   setLoading(true);
  //   try {
  //     await createChallenge({
  //       title,
  //       description,
  //       imageFile: image || undefined,
  //       hashtag: formattedHashtag,
  //       startDate: startDate.getTime(),
  //       endDate: endDate.getTime(),
  //       tips: filteredTips
  //     });
      
  //     toast.success("Challenge created successfully!");
  //     navigate("/challenges");
  //   } catch (error) {
  //     console.error("Error creating challenge:", error);
  //     toast.error("Failed to create challenge. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !description || !hashtag || !startDate || !endDate) {
    toast.error("Please fill in all required fields");
    return;
  }

  // Format hashtag correctly
  const formattedHashtag = hashtag.startsWith("#")
    ? hashtag.substring(1)
    : hashtag;

  // Filter out empty tips
  const filteredTips = tips.filter(tip => tip.trim() !== "");

  setLoading(true);

  let base64Image: string | null = null;
  if (image) {
    const reader = new FileReader();
    await new Promise((resolve) => {
      reader.onloadend = () => {
        base64Image = reader.result as string;
        resolve(null);
      };
      reader.readAsDataURL(image);
    });
  }

  try {
    await createChallenge({
      title,
      description,
      imageFile: image,
      hashtag: formattedHashtag,
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      tips: filteredTips
    });

    toast.success("Challenge created successfully!");
    navigate("/challenges");
  } catch (error) {
    console.error("Error creating challenge:", error);
    toast.error("Failed to create challenge. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title*</Label>
              <Input
                id="title"
                placeholder="Give your challenge a clear, motivating title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                placeholder="Describe your challenge, its goals, and how people can complete it"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Hashtag */}
            <div className="space-y-2">
              <Label htmlFor="hashtag">Challenge Hashtag*</Label>
              <Input
                id="hashtag"
                placeholder="A unique hashtag for your challenge (no spaces)"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value.replace(/\s+/g, ''))}
                required
              />
              <p className="text-sm text-muted-foreground">
                This will be used to track posts for your challenge
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Challenge Image</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                >
                  <ImageIcon className="mr-2 h-4 w-4" /> Upload Image
                </Button>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-sm text-muted-foreground">
                  {image ? image.name : "No file chosen"}
                </span>
              </div>
              {imagePreview && (
                <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        // If end date is before new start date, update it
                        if (endDate && date && date > endDate) {
                          setEndDate(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => 
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Challenge Tips */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tips">Challenge Tips</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={addTip}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Tip
                </Button>
              </div>
              <div className="space-y-2">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={tip}
                      onChange={(e) => handleTipChange(index, e.target.value)}
                      placeholder={`Tip ${index + 1}: How to succeed in this challenge`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTip(index)}
                      disabled={tips.length <= 1}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/challenges")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Challenge
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}