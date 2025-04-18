
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/FileUpload";
import { 
  Send, Bot, User, CheckCircle, Clock, AlertCircle,
  BookOpen, School, GraduationCap, FileCheck, PenTool, Languages
} from "lucide-react";

type MessageType = {
  id: string;
  type: "user" | "system";
  content: string | React.ReactNode;
  timestamp: Date;
};

type ProcessingStepType = {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  details?: string;
  icon: React.ReactNode;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      type: "system",
      content: "欢迎使用超级网申系统！请上传您的申请材料，我们将为您自动解析并填写申请表格。",
      timestamp: new Date(),
    },
  ]);
  
  const [processingSteps, setProcessingSteps] = useState<ProcessingStepType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
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
    
    // Simulate system response after a delay
    setTimeout(() => {
      const systemResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: "我已收到您的消息。您可以继续上传申请材料，或者提出有关申请流程的问题。",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, systemResponse]);
    }, 1000);
  };
  
  const handleFilesProcessed = (files: string[]) => {
    // Add user message for uploaded files
    const fileListMsg = (
      <div>
        <p>我上传了以下文件：</p>
        <ul className="list-disc list-inside mt-1">
          {files.map((file, index) => (
            <li key={index} className="text-sm">{file}</li>
          ))}
        </ul>
      </div>
    );
    
    const newMessage: MessageType = {
      id: Date.now().toString(),
      type: "user",
      content: fileListMsg,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Start processing simulation
    setIsProcessing(true);
    
    // Initialize processing steps
    const initialSteps: ProcessingStepType[] = [
      {
        id: "ps",
        name: "个人陈述 (PS)",
        status: "pending",
        icon: <PenTool className="w-4 h-4" />,
      },
      {
        id: "cv",
        name: "简历 (CV)",
        status: "pending",
        icon: <FileCheck className="w-4 h-4" />,
      },
      {
        id: "transcript",
        name: "成绩单",
        status: "pending",
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        id: "certificates",
        name: "学位证书",
        status: "pending",
        icon: <GraduationCap className="w-4 h-4" />,
      },
      {
        id: "language",
        name: "语言成绩",
        status: "pending", 
        icon: <Languages className="w-4 h-4" />,
      },
    ];
    
    setProcessingSteps(initialSteps);
    
    // Add system processing message
    const processingMsg: MessageType = {
      id: (Date.now() + 1).toString(),
      type: "system",
      content: "正在解析您上传的申请材料，请稍等...",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, processingMsg]);
    
    // Simulate processing steps with delays
    let stepIndex = 0;
    const processStep = () => {
      if (stepIndex < initialSteps.length) {
        setProcessingSteps(prev => {
          const updated = [...prev];
          // Set current step to processing
          updated[stepIndex].status = "processing";
          return updated;
        });
        
        // Simulate processing time for current step
        setTimeout(() => {
          setProcessingSteps(prev => {
            const updated = [...prev];
            // Complete current step
            updated[stepIndex].status = "completed";
            
            // Add details based on step
            switch (stepIndex) {
              case 0: // PS
                updated[stepIndex].details = "已识别研究兴趣：人工智能、自然语言处理";
                break;
              case 1: // CV
                updated[stepIndex].details = "已提取工作经历：3段实习经验，2个项目";
                break;
              case 2: // Transcript
                updated[stepIndex].details = "GPA：3.85/4.0，主修课程：15门";
                break;
              case 3: // Certificates
                updated[stepIndex].details = "本科学位：计算机科学, 优秀毕业生";
                break;
              case 4: // Language
                updated[stepIndex].details = "托福: 105, GRE: 325";
                break;
            }
            
            return updated;
          });
          
          stepIndex++;
          processStep();
        }, 1500); // Time for each step processing
      } else {
        // All steps completed
        setTimeout(() => {
          const completionMsg: MessageType = {
            id: (Date.now() + 100).toString(),
            type: "system",
            content: "材料解析完成！我已经根据您的文件自动填写了申请表，请检查并确认。",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, completionMsg]);
          setIsProcessing(false);
          setShowForm(true);
        }, 1000);
      }
    };
    
    // Start processing after a delay
    setTimeout(processStep, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-4">
          {/* Chat and file upload area */}
          <Card className="flex flex-col h-full border">
            <div className="p-4 border-b bg-card">
              <h2 className="text-lg font-medium flex items-center">
                <Bot className="mr-2 h-5 w-5 text-app-blue" />
                AI助手对话
              </h2>
            </div>
            
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
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
            
            {/* File upload component */}
            <div className="p-4 border-t">
              {isProcessing ? (
                <div className="text-center py-2 text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    <span>正在处理您的申请材料...</span>
                  </div>
                </div>
              ) : (
                <FileUpload onFilesProcessed={handleFilesProcessed} />
              )}
            </div>
            
            {/* Input area */}
            <div className="p-4 border-t mt-auto">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="输入您的问题或要求..."
                  className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <Button
                  size="icon"
                  className="ml-2 bg-app-blue hover:bg-app-blue-dark"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Processing status and form preview */}
          <Card className="flex flex-col h-full border">
            <div className="p-4 border-b bg-card">
              <h2 className="text-lg font-medium flex items-center">
                <School className="mr-2 h-5 w-5 text-app-blue" />
                申请表格处理
              </h2>
            </div>
            
            <div className="flex-1 overflow-auto">
              {processingSteps.length > 0 ? (
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-3">材料处理进度</h3>
                  <div className="space-y-3">
                    {processingSteps.map((step) => (
                      <div key={step.id} className="bg-accent/30 rounded-md p-3">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {step.status === "pending" && (
                              <Clock className="h-5 w-5 text-muted-foreground" />
                            )}
                            {step.status === "processing" && (
                              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                            )}
                            {step.status === "completed" && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {step.status === "error" && (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              {step.icon}
                              <span className="ml-1 font-medium">{step.name}</span>
                            </div>
                            {step.details && (
                              <p className="text-xs text-muted-foreground mt-1">{step.details}</p>
                            )}
                          </div>
                          <div className="text-xs">
                            {step.status === "pending" && "等待处理"}
                            {step.status === "processing" && "处理中..."}
                            {step.status === "completed" && "已完成"}
                            {step.status === "error" && "处理失败"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center p-4">
                    <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                    <h3 className="font-medium">申请表格预览</h3>
                    <p className="text-sm mt-1">上传申请材料后，AI将在此处生成申请表格</p>
                  </div>
                </div>
              )}
              
              {showForm && (
                <>
                  <Separator className="my-4" />
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-4">哈佛大学 - 计算机科学申请表</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">姓名</label>
                          <input
                            type="text"
                            className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-app-blue/5"
                            value="张明"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">申请专业</label>
                          <input
                            type="text"
                            className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-app-blue/5"
                            value="计算机科学 (PhD)"
                            readOnly
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">学历背景</label>
                        <input
                          type="text"
                          className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-app-blue/5"
                          value="本科：计算机科学，优秀毕业生"
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">GPA</label>
                        <input
                          type="text"
                          className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-app-blue/5"
                          value="3.85/4.0"
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">语言成绩</label>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                          <input
                            type="text"
                            className="border border-input rounded-md px-3 py-2 text-sm bg-app-blue/5"
                            value="托福: 105"
                            readOnly
                          />
                          <input
                            type="text"
                            className="border border-input rounded-md px-3 py-2 text-sm bg-app-blue/5"
                            value="GRE: 325"
                            readOnly
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">研究兴趣</label>
                        <textarea
                          className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-app-blue/5 resize-none"
                          rows={3}
                          value="人工智能、自然语言处理"
                          readOnly
                        />
                      </div>
                      
                      <Button className="w-full bg-app-blue hover:bg-app-blue-dark">
                        确认并提交申请
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
