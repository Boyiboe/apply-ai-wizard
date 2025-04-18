
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="p-4 border-t mt-auto">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="输入您的问题或要求..."
          className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
        />
        <Button
          size="icon"
          className="ml-2 bg-app-blue hover:bg-app-blue-dark"
          onClick={onSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
