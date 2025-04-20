
import { Button } from "@/components/ui/button";
import { Send, Import, Attach } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="px-6 py-4 border-t mt-auto bg-black/95">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 bg-[#1A1F2C] rounded-xl border border-white/10 p-2">
          <div className="flex items-center gap-2 px-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Attach className="h-5 w-5" />
              <span className="ml-2">Attach</span>
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Import className="h-5 w-5" />
              <span className="ml-2">Import</span>
            </Button>
          </div>
          <input
            type="text"
            placeholder="帮我设计一个AI问答网站，可上传材料"
            className="flex-1 px-4 py-2 bg-transparent border-none focus:outline-none text-base text-white placeholder:text-white/50"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className="mr-2 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
