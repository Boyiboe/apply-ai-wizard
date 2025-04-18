
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PanelLeftClose, PanelLeftOpen, Plus, FileText, BarChart3, User, Search } from "lucide-react";

type ApplicationRecord = {
  id: string;
  school: string;
  program: string;
  date: string;
  status: "inProgress" | "completed" | "pending";
};

// Sample data
const RECENT_APPLICATIONS: ApplicationRecord[] = [
  { 
    id: "1", 
    school: "哈佛大学", 
    program: "计算机科学", 
    date: "今天", 
    status: "inProgress" 
  },
  { 
    id: "2", 
    school: "斯坦福大学", 
    program: "人工智能", 
    date: "今天", 
    status: "completed" 
  },
  { 
    id: "3", 
    school: "麻省理工", 
    program: "数据科学", 
    date: "昨天", 
    status: "pending" 
  },
  { 
    id: "4", 
    school: "伯克利", 
    program: "电子工程", 
    date: "3天前", 
    status: "completed" 
  },
  { 
    id: "5", 
    school: "剑桥大学", 
    program: "计算机视觉", 
    date: "5天前", 
    status: "completed" 
  },
];

const StatusBadge = ({ status }: { status: ApplicationRecord["status"] }) => {
  const styles = {
    inProgress: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    completed: "bg-green-100 text-green-800 hover:bg-green-100",
    pending: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  };
  
  const labels = {
    inProgress: "进行中",
    completed: "已完成",
    pending: "待处理",
  };
  
  return (
    <Badge className={`${styles[status]} font-normal`} variant="outline">
      {labels[status]}
    </Badge>
  );
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={`bg-sidebar h-screen border-r border-sidebar-border transition-all duration-300 flex flex-col ${
        collapsed ? "w-[72px]" : "w-[280px]"
      }`}
    >
      {/* Header - Logo Area */}
      <div className="p-4 flex items-center justify-between h-16">
        {!collapsed && (
          <div className="font-bold text-sidebar-primary text-lg">超级网申系统</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </Button>
      </div>
      
      {/* New Application Button */}
      <div className="px-3 py-2">
        <Button 
          className={`${collapsed ? "w-full p-2 justify-center" : "w-full"} bg-app-blue hover:bg-app-blue-dark transition-all`}
        >
          <Plus size={20} className={collapsed ? "mx-auto" : "mr-2"} />
          {!collapsed && <span>开启新申请</span>}
        </Button>
      </div>
      
      {/* User Profile */}
      <div className={`p-3 ${collapsed ? "items-center justify-center" : ""} flex`}>
        <Avatar className={collapsed ? "mx-auto" : "mr-3"}>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>用户</AvatarFallback>
        </Avatar>
        
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-medium text-sidebar-foreground">张同学</span>
            <span className="text-xs text-muted-foreground">申请进度：3/5</span>
          </div>
        )}
      </div>
      
      <Separator className="my-2" />
      
      {/* Search Bar - Only shown when expanded */}
      {!collapsed && (
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索申请记录..."
              className="w-full bg-accent/50 pl-8 py-2 text-sm rounded-md border border-input focus:border-sidebar-primary focus:outline-none focus:ring-2 focus:ring-sidebar-ring/40 transition-all"
            />
          </div>
        </div>
      )}
      
      {/* Application History */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center px-4 py-2">
          {!collapsed && <span className="text-xs font-medium text-sidebar-foreground">申请历史</span>}
          <FileText size={collapsed ? 20 : 16} className={collapsed ? "mx-auto" : "ml-auto"} />
        </div>
        
        <ScrollArea className="h-[calc(100vh-230px)]">
          {!collapsed ? (
            <div className="px-3 space-y-1">
              {RECENT_APPLICATIONS.map((app) => (
                <div
                  key={app.id}
                  className="p-2 rounded-md hover:bg-sidebar-accent group cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sidebar-foreground">{app.school}</div>
                      <div className="text-xs text-muted-foreground">{app.program}</div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{app.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 mt-4">
              {/* Icons only for collapsed state */}
              <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent">
                <BarChart3 size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent">
                <User size={20} />
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
