import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, Bot, CheckCircle, Clock, 
  BookOpen, School, GraduationCap, FileCheck, PenTool, 
  Languages, UserCheck, FileText, FileWarning, HelpCircle, Check, X
} from "lucide-react";
import { useForm } from "react-hook-form";

import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { FormPreview } from "./FormPreview";

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
  const form = useForm();

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
    
    // Add processing status message to chat（只添加一次）
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
    
    // Simulate processing steps with delays（只刷新进度，不再插入进度消息到聊天）
    let stepIndex = 0;
    const processStep = () => {
      if (stepIndex < initialSteps.length) {
        // Update processing steps state 
        setProcessingSteps(prev => {
          const updated = [...prev];
          if (stepIndex >= 0 && stepIndex < updated.length) {
            updated[stepIndex].status = "processing";
          }
          return updated;
        });
        // 不再插入进度消息到聊天
        setTimeout(() => {
          setProcessingSteps(prev => {
            const updated = [...prev];
            if (stepIndex < 0 || stepIndex >= updated.length) {
              return updated;
            }
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

  // 渲染方法
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-4">
          {/* 聊天和文件上传区域 */}
          <Card className="flex flex-col h-full border">
            <div className="p-4 border-b bg-card">
              <h2 className="text-lg font-medium flex items-center">
                <Bot className="mr-2 h-5 w-5 text-app-blue" />
                AI助手对话
              </h2>
            </div>
            {/* 聊天消息显示 */}
            <ChatMessages messages={messages} />
            {/* 文件上传 */}
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
            {/* 输入区域 */}
            <div className="p-4 border-t mt-auto">
              <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSend={handleSendMessage}
                disabled={isProcessing}
              />
            </div>
          </Card>
          {/* 表单预览区域 */}
          <Card className="relative flex flex-col h-full border">
            <div className="p-4 border-b bg-card">
              <h2 className="text-lg font-medium flex items-center">
                <School className="mr-2 h-5 w-5 text-app-blue" />
                申请表格预览
              </h2>
            </div>
            <FormPreview
              showForm={showForm}
              formFields={formFields}
              onSubmit={handleSubmitForm}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
