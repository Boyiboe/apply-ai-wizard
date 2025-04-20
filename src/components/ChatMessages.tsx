
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
                    ? "bg-blue-500 text-white"
                    : "bg-[#E5F3FF]"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.type === "system" ? (
                    <Bot className="h-4 w-4 mr-1 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 mr-1 text-white" />
                  )}
                  <span className={`text-xs ${message.type === "user" ? "text-white/90" : "text-blue-600"}`}>
                    {message.type === "system" ? "KIMI" : "您"}
                  </span>
                </div>
                <div className={`${message.type === "user" ? "text-white" : "text-gray-700"}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }
);

ChatMessages.displayName = "ChatMessages";
