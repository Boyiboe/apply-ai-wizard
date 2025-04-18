
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import { MessageType } from "@/types/chat";
import { forwardRef } from "react";

interface ChatMessagesProps {
  messages: MessageType[];
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages }, ref) => {
    return (
      <ScrollArea className="flex-1 p-4" ref={ref}>
        <div className="space-y-4">
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
        </div>
      </ScrollArea>
    );
  }
);

ChatMessages.displayName = "ChatMessages";
