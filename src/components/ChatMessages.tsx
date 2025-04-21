
import { useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";

type MessageType = {
  id: string;
  type: "user" | "system";
  content: string | React.ReactNode;
  timestamp: Date;
};

interface ChatMessagesProps {
  messages: MessageType[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  // 保持聊天底部滚动
  useEffect(() => {
    if (chatScrollAreaRef.current) {
      const scrollElement = chatScrollAreaRef.current;
      const isNearBottom =
        scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop < 100;

      if (isNearBottom && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300"
      ref={chatScrollAreaRef}
    >
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="flex items-center mb-1">
                {message.type === "system" ? (
                  <Bot className="h-4 w-4 mr-1" />
                ) : (
                  <User className="h-4 w-4 mr-1" />
                )}
                <span className="text-xs opacity-70">
                  {message.type === "system" ? "AI助手" : "您"}
                </span>
              </div>
              <div>{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
