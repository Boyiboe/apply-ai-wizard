import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { 
  Send, Bot, User, CheckCircle, Clock, AlertCircle,
  BookOpen, School, GraduationCap, FileCheck, PenTool, 
  Languages, Briefcase, FileText, UserCheck,
  FileWarning, HelpCircle, Check, X
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
  status: "pending" | "processing" | "completed" | "error" | "warning";
  details?: string;
  icon: React.ReactNode;
  source?: string;
};

type FormFieldType = {
  id: string;
  label: string;
  value: string;
  source?: string;
  conflictValue?: string;
  conflictSource?: string;
  required: boolean;
  category: string;
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
  const [formFields, setFormFields] = useState<FormFieldType[]>([]);
  
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const form = useForm();
  
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
      {
        id: "recommendation",
        name: "推荐信",
        status: "pending",
        icon: <UserCheck className="w-4 h-4" />,
      },
      {
        id: "passport",
        name: "护照/身份证",
        status: "pending",
        icon: <FileText className="w-4 h-4" />,
      },
    ];
    
    setProcessingSteps(initialSteps);
    
    // Add processing status message to chat
    const processingMsg: MessageType = {
      id: Date.now().toString(),
      type: "system",
      content: (
        <div className="space-y-3">
          <p>正在解析您上传的申请材料，请稍等...</p>
          <div className="bg-accent/30 rounded-md p-3">
            <div className="space-y-2">
              {initialSteps.map((step) => (
                <div key={step.id} className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{step.name}</span>
                  <span className="ml-auto text-xs">等待处理</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, processingMsg]);
    
    // Simulate processing steps with delays
    let stepIndex = 0;
    const processStep = () => {
      if (stepIndex < initialSteps.length) {
        // Update processing steps state
        setProcessingSteps(prev => {
          const updated = [...prev];
          updated[stepIndex].status = "processing";
          return updated;
        });
        
        // Add processing update message to chat
        const processingUpdateMsg: MessageType = {
          id: Date.now().toString(),
          type: "system",
          content: (
            <div className="space-y-3">
              <div className="bg-accent/30 rounded-md p-3">
                <div className="space-y-2">
                  {initialSteps.map((step, idx) => (
                    <div key={step.id} className="flex items-center text-sm">
                      {idx < stepIndex ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      ) : idx === stepIndex ? (
                        <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                      ) : (
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      )}
                      <span>{step.name}</span>
                      <span className="ml-auto text-xs">
                        {idx < stepIndex ? "已完成" : 
                         idx === stepIndex ? "处理中..." : 
                         "等待处理"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ),
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, processingUpdateMsg]);
        
        // Continue with processing simulation
        setTimeout(() => {
          setProcessingSteps(prev => {
            const updated = [...prev];
            
            // Randomly assign statuses to demonstrate different scenarios
            const statuses: ("completed" | "error" | "warning")[] = ["completed", "completed", "completed", "warning"];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Complete current step
            updated[stepIndex].status = stepIndex === 5 && files.length < 2 ? "warning" : randomStatus;
            
            // Add details based on step
            switch (stepIndex) {
              case 0: // PS
                updated[stepIndex].details = "已识别研究兴趣：人工智能、自然语言处理";
                updated[stepIndex].source = "个人陈述.pdf";
                break;
              case 1: // CV
                updated[stepIndex].details = "已提取工作经历：3段实习经验，2个项目";
                updated[stepIndex].source = "简历.pdf";
                break;
              case 2: // Transcript
                updated[stepIndex].details = "GPA：3.85/4.0，主修课程：15门";
                updated[stepIndex].source = "成绩单.pdf";
                break;
              case 3: // Certificates
                updated[stepIndex].details = "本科学位：计算机科学, 优秀毕业生";
                updated[stepIndex].source = "学位证书.jpg";
                break;
              case 4: // Language
                updated[stepIndex].details = "托福: 105, GRE: 325";
                updated[stepIndex].source = "语言成绩.pdf";
                break;
              case 5: // Recommendation
                if (files.length < 2) {
                  updated[stepIndex].details = "⚠️ 仅检测到1封推荐信，申请通常需要2-3封";
                  updated[stepIndex].source = "推荐信.pdf";
                } else {
                  updated[stepIndex].details = "已解析2封推荐信，推荐人：教授、实习导师";
                  updated[stepIndex].source = "推荐信1.pdf, 推荐信2.pdf";
                }
                break;
              case 6: // Passport
                if (randomStatus === "warning") {
                  updated[stepIndex].details = "⚠️ 护照扫描质量较低，部分信息提取置信度不高";
                  updated[stepIndex].source = "护照扫描件.jpg";
                } else {
                  updated[stepIndex].details = "已提取：姓名、出生日期、护照号";
                  updated[stepIndex].source = "护照扫描件.pdf";
                }
                break;
            }
            
            return updated;
          });
          
          stepIndex++;
          processStep();
        }, 1500);
      } else {
        // All steps completed - generate form fields
        setTimeout(() => {
          // Generate form fields with some conflicts to demonstrate
          const generatedFields: FormFieldType[] = [
            {
              id: "name_cn",
              label: "姓名（中文）",
              value: "张明",
              source: "学位证书.jpg",
              required: true,
              category: "个人信息",
            },
            {
              id: "name_en",
              label: "姓名（英文）",
              value: "ZHANG Ming",
              source: "护照扫描件.pdf",
              required: true,
              category: "个人信息",
            },
            {
              id: "birth_date",
              label: "出生日期",
              value: "1999-05-15",
              source: "护照扫描件.pdf",
              required: true,
              category: "个人信息",
            },
            {
              id: "gender",
              label: "性别",
              value: "男",
              source: "护照扫描件.pdf",
              required: true,
              category: "个人信息",
            },
            {
              id: "passport",
              label: "护照号码",
              value: "E12345678",
              source: "护照扫描件.pdf",
              required: true,
              category: "个人信息",
            },
            {
              id: "email",
              label: "电子邮箱",
              value: "zhangming@example.com",
              source: "简历.pdf",
              required: true,
              category: "个人信息",
            },
            {
              id: "phone",
              label: "电话号码",
              value: "+86 138 0000 0000",
              source: "简历.pdf",
              required: true,
              category: "个人信息",
            },
            {
              id: "education_level",
              label: "最高学历",
              value: "本科",
              source: "学位证书.jpg",
              required: true,
              category: "教育背景",
            },
            {
              id: "university",
              label: "毕业院校",
              value: "北京大学",
              source: "学位证书.jpg",
              required: true,
              category: "教育背景",
            },
            {
              id: "major",
              label: "专业",
              value: "计算机科学",
              source: "学位证书.jpg",
              required: true,
              category: "教育背景",
            },
            {
              id: "gpa",
              label: "GPA",
              value: "3.85/4.0",
              source: "成绩单.pdf",
              conflictValue: "3.9/4.0",
              conflictSource: "个人陈述.pdf",
              required: true,
              category: "教育背景",
            },
            {
              id: "graduation_date",
              label: "毕业日期",
              value: "2023-06-30",
              source: "学位证书.jpg",
              required: true,
              category: "教育背景",
            },
            {
              id: "toefl",
              label: "托福成绩",
              value: "105",
              source: "语言成绩.pdf",
              required: true,
              category: "语言能力",
            },
            {
              id: "toefl_reading",
              label: "托福阅读",
              value: "28",
              source: "语言成绩.pdf",
              required: false,
              category: "语言能力",
            },
            {
              id: "toefl_listening",
              label: "托福听力",
              value: "27",
              source: "语言成绩.pdf",
              required: false,
              category: "语言能力",
            },
            {
              id: "toefl_speaking",
              label: "托福口语",
              value: "23",
              source: "语言成绩.pdf",
              required: false,
              category: "语言能力",
            },
            {
              id: "toefl_writing",
              label: "托福写作",
              value: "27",
              source: "语言成绩.pdf",
              required: false,
              category: "语言能力",
            },
            {
              id: "gre",
              label: "GRE成绩",
              value: "325",
              source: "语言成绩.pdf",
              required: true,
              category: "语言能力",
            },
            {
              id: "gre_verbal",
              label: "GRE词汇",
              value: "160",
              source: "语言成绩.pdf",
              required: false,
              category: "语言能力",
            },
            {
              id: "gre_quantitative",
              label: "GRE数学",
              value: "165",
              source: "语言成绩.pdf",
              required: false,
              category: "语言能力",
            },
            {
              id: "gre_writing",
              label: "GRE写作",
              value: "4.0",
              source: "语言成绩.pdf",
              required: false,
              category: "语言能力",
            },
            {
              id: "research_interests",
              label: "研究兴趣",
              value: "人工智能、自然语言处理",
              source: "个人陈述.pdf",
              required: true,
              category: "申请信息",
            },
            {
              id: "target_program",
              label: "申请项目",
              value: "计算机科学 (PhD)",
              source: "个人陈述.pdf",
              required: true,
              category: "申请信息",
            },
            {
              id: "recommender1",
              label: "推荐人1",
              value: "王教授，北京大学计算机科学学院",
              source: "推荐信1.pdf",
              required: true,
              category: "推荐信息",
            },
            {
              id: "recommender2",
              label: "推荐人2",
              value: "李主管，ABC科技公司",
              source: "推荐信2.pdf",
              required: true,
              category: "推荐信息",
            }
          ];
          
          setFormFields(generatedFields);
          
          const completionMsg: MessageType = {
            id: (Date.now() + 100).toString(),
            type: "system",
            content: "材料解析完成！我已经根据您的文件自动填写了申请表，请检查并确认。注意：检测到部分信息存在冲突，已用红色标记，请手动确认正确值。",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, completionMsg]);
          setIsProcessing(false);
          setShowForm(true);
          
          // Show toast for conflicts
          if (generatedFields.some(field => field.conflictValue)) {
            toast({
              title: "检测到信息冲突",
              description: "部分字段在不同文件中存在不一致，请检查并确认正确值。",
              variant: "destructive",
            });
          }
          
          // Show toast for warnings
          if (processingSteps.some(step => step.status === "warning")) {
            toast({
              title: "部分文件解析存在警告",
              description: "某些文件解析质量不佳或信息不完整，可能需要手动补充。",
              variant: "default",
            });
          }
          
        }, 1000);
      }
    };
    
    // Start processing after a delay
    setTimeout(processStep, 1500);
  };

  const handleSubmitForm = () => {
    toast({
      title: "申请已提交",
      description: "您的申请已成功提交，我们会尽快处理并与您联系。",
    });
    
    // Add a confirmation message to the chat
    const confirmationMsg: MessageType = {
      id: Date.now().toString(),
      type: "system",
      content: (
        <div className="space-y-2">
          <p className="font-medium">申请已成功提交！</p>
          <p>您的申请表格已提交至哈佛大学招生办公室。请注意查收确认邮件，并准备可能的后续面试。</p>
          <p>如有任何问题，请随时与我联系！</p>
        </div>
      ),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, confirmationMsg]);
    setShowForm(false);
  };
  
  // Add the missing renderFormSection function
  const renderFormSection = (category: string) => {
    const categoryFields = formFields.filter(field => field.category === category);
    
    if (categoryFields.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h4 className="text-base font-medium mb-3">{category}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <div className="flex items-center">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.conflictValue && (
                  <div className="ml-auto flex items-center text-xs text-red-500">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>信息冲突</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full border px-3 py-2 rounded-md text-sm ${
                      field.conflictValue ? "border-red-300 bg-red-50" : "border-input"
                    }`}
                    defaultValue={field.value}
                  />
                  {field.source && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>来源: {field.source}</span>
                    </div>
                  )}
                </div>
                
                {field.conflictValue && (
                  <div className="bg-muted p-2 rounded-md text-sm border border-border">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <FileWarning className="h-3 w-3 mr-1" />
                        <span>冲突值 (来源: {field.conflictSource})</span>
                      </div>
                      <div className="flex space-x-1">
                        <button className="text-xs bg-green-500 text-white p-1 rounded-sm flex items-center">
                          <Check className="h-3 w-3 mr-0.5" />
                          <span>使用</span>
                        </button>
                        <button className="text-xs bg-muted-foreground text-white p-1 rounded-sm flex items-center">
                          <X className="h-3 w-3 mr-0.5" />
                          <span>忽略</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">{field.conflictValue}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Modified render method to show form content
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
          
          {/* Form preview */}
          <Card className="relative flex flex-col h-full border">
            <div className="p-4 border-b bg-card">
              <h2 className="text-lg font-medium flex items-center">
                <School className="mr-2 h-5 w-5 text-app-blue" />
                申请表格预览
              </h2>
            </div>
            <div className="relative flex-1">
              {!showForm ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center p-4">
                    <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                    <h3 className="font-medium">申请表格预览</h3>
                    <p className="text-sm mt-1">上传申请材料后，AI将在此处生成申请表格</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Scrollable preview */}
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-3">
                      <div className="p-4 pb-24 space-y-8">
                        {/* Form header和状态说明 */}
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">哈佛大学 - 计算机科学申请表</h3>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                              <span>已填充</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                              <span>冲突</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                              <span>警告</span>
                            </div>
                          </div>
                        </div>

                        {/* Form sections */}
                        {renderFormSection("个人信息")}
                        {renderFormSection("教育背景")}
                        {renderFormSection("语言能力")}
                        {renderFormSection("申请信息")}
                        {renderFormSection("推荐信息")}

                        {/* 占位，用于底部按钮与内容分离 */}
                        <div className="h-12 md:h-16" />
                      </div>
                    </ScrollArea>
                  </div>

                  {/* 悬浮的右下角submit按钮 */}
                  <div className="absolute bottom-4 right-4 z-20">
                    <Button
                      className="bg-app-blue hover:bg-app-blue-dark min-w-[140px] shadow-lg"
                      onClick={handleSubmitForm}
                    >
                      确认并提交申请
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
