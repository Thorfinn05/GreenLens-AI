
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, ImageIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { toast } from "sonner";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { createCampaign } = useCommunity();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const campaignData = {
      title,
      description,
      hashtag,
      startDate: startDate?.getTime(),
      endDate: endDate?.getTime(),
      base64Image, // Include the Base64 encoded image data
    };

    try {
      await createCampaign(campaignData);
      toast.success("Campaign created successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      toast.error(`Failed to create campaign: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit(event);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title*</Label>
              <Input
                id="title"
                placeholder="Give your campaign a clear, action-oriented title"
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
                placeholder="Describe your campaign's goals and how people can participate"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Hashtag */}
            <div className="space-y-2">
              <Label htmlFor="hashtag">Campaign Hashtag*</Label>
              <Input
                id="hashtag"
                placeholder="A unique hashtag for your campaign (no spaces)"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value.replace(/\s+/g, ''))}
                required
              />
              <p className="text-sm text-muted-foreground">
                This will be used to track posts for your campaign
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Campaign Image</Label>
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
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
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

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/campaigns")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Campaign
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}