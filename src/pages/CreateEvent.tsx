
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, ImageIcon, Loader2, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addHours } from "date-fns";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent } = useCommunity();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");
  const [duration, setDuration] = useState("1");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getHourOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, "0");
        const minute = j.toString().padStart(2, "0");
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!title || !description || !address || !date || !time) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // Parse date and time
  //     const [hours, minutes] = time.split(":").map(num => parseInt(num));
  //     const eventDate = new Date(date);
  //     eventDate.setHours(hours, minutes, 0, 0);
      
  //     // Calculate end date based on duration
  //     const durationHours = parseInt(duration);
  //     const endDate = addHours(eventDate, durationHours);

  //     await createEvent({
  //       title,
  //       description,
  //       imageFile: image || undefined,
  //       location: {
  //         address,
  //         // In a production app, we would add geocoding here to get lat/lng
  //       },
  //       date: eventDate.getTime(),
  //       endDate: endDate.getTime()
  //     });
      
  //     toast.success("Event created successfully!");
  //     navigate("/events");
  //   } catch (error) {
  //     console.error("Error creating event:", error);
  //     toast.error("Failed to create event. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !description || !address || !date || !time) {
    toast.error("Please fill in all required fields");
    return;
  }

  const [hours, minutes] = time.split(":").map(Number);
  const eventDate = new Date(date);
  eventDate.setHours(hours, minutes, 0, 0);

  const durationHours = parseFloat(duration);
  const endDate = addHours(eventDate, durationHours);

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
    await createEvent({
      title,
      description,
      base64Image,
      location: { address },
      date: eventDate.getTime(),
      endDate: endDate.getTime()
    });

    toast.success("Event created successfully!");
    navigate("/events");
  } catch (error) {
    console.error("Error creating event:", error);
    toast.error("Failed to create event. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title*</Label>
              <Input
                id="title"
                placeholder="Give your event a descriptive title"
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
                placeholder="Describe your event, its purpose, and what attendees should expect"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="address">Location*</Label>
              <div className="relative">
                <Input
                  id="address"
                  placeholder="Enter the address or location of your event"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-9"
                  required
                />
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time">Time*</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {getHourOptions().map((timeOption) => (
                      <SelectItem key={timeOption} value={timeOption}>
                        {timeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)*</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {[0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 24].map((hours) => (
                    <SelectItem key={hours} value={hours.toString()}>
                      {hours === 0.5 ? "30 minutes" : `${hours} hour${hours > 1 ? "s" : ""}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Event Image</Label>
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

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/events")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}