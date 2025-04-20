
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { MessageType } from "@/types/chat";
import { SuperApplyLogo } from "@/components/SuperApplyLogo";

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      type: "system",
      content: "您好！我是超级网申助手，请问有什么可以帮您？",
      timestamp: new Date(),
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
    const newMessage: MessageType = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    
    setTimeout(() => {
      const systemResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: "我理解您的问题，让我为您详细解答...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      <Card className="flex flex-col h-full border border-blue-100">
        <div className="flex flex-col items-center justify-center p-8 border-b bg-[#E5F3FF]/80">
          <div className="h-20 w-20 flex items-center justify-center mb-4">
            <SuperApplyLogo className="h-20 w-20" />
          </div>
          <h2 className="text-3xl font-bold text-[#003366]">超级网申</h2>
          <p className="text-sm text-[#003366]/80 mt-2">高效·科技·可靠</p>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            <div className="flex flex-col h-full">
              <ChatMessages ref={scrollRef} messages={messages} />
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
