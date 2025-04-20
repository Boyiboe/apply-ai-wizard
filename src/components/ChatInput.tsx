
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="px-6 py-4 border-t mt-auto bg-[#F2FCE2]/95">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 bg-white/80 rounded-xl border border-green-100 p-2">
          <input
            type="text"
            placeholder="请输入您的问题..."
            className="flex-1 px-4 py-2 bg-transparent border-none focus:outline-none text-base text-gray-800 placeholder:text-gray-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className="mr-2 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={onSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
