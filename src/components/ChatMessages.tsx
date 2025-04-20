
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { MessageType } from "@/types/chat";
import { forwardRef } from "react";
import { SuperApplyLogo } from "@/components/SuperApplyLogo";

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
                    ? "bg-[#FF6B35] text-white"
                    : "bg-[#E5F3FF]"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.type === "system" ? (
                    <div className="h-4 w-4 mr-1">
                      <SuperApplyLogo className="h-4 w-4" />
                    </div>
                  ) : (
                    <User className="h-4 w-4 mr-1 text-white" />
                  )}
                  <span className={`text-xs ${message.type === "user" ? "text-white/90" : "text-[#003366]"}`}>
                    {message.type === "system" ? "超级网申" : "您"}
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
