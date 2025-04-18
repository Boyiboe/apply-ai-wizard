
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="px-6 py-4 border-t mt-auto">
      <div className="flex items-center bg-background rounded-lg border max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="输入您的问题，帮你深度解答..."
          className="flex-1 px-6 py-4 bg-transparent border-none focus:outline-none text-base"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
        />
        <Button
          size="icon"
          variant="ghost"
          className="mr-3"
          onClick={onSend}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
