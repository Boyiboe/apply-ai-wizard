
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
      <div className="flex items-center bg-background rounded-lg border">
        <input
          type="text"
          placeholder="输入您的问题，帮你深度解答..."
          className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
        />
        <Button
          size="icon"
          variant="ghost"
          className="mr-2"
          onClick={onSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
