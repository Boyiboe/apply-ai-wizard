
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React from "react";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ inputValue, setInputValue, onSend, disabled }: ChatInputProps) {
  return (
    <div className="flex items-center">
      <Input
        type="text"
        placeholder="输入您的问题或要求..."
        className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
        disabled={disabled}
      />
      <Button
        size="icon"
        className="ml-2 bg-app-blue hover:bg-app-blue-dark"
        onClick={onSend}
        disabled={disabled}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
