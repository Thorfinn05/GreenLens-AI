
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  isSubmitted: boolean;
  onSubmit: () => void;
}

const ApiKeyInput = ({ 
  apiKey, 
  setApiKey, 
  isSubmitted, 
  onSubmit 
}: ApiKeyInputProps) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type={showApiKey ? "text" : "password"}
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
            disabled={isSubmitted}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
        {!isSubmitted && (
          <Button type="submit" disabled={!apiKey.trim()}>
            Save Key
          </Button>
        )}
        {isSubmitted && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setApiKey("")}
          >
            Change
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally and never sent to our servers.
      </p>
    </form>
  );
};

export default ApiKeyInput;
