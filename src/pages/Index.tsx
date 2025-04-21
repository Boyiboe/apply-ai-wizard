
import { AppSidebar } from "@/components/AppSidebar";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <main className="flex-1 h-full overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
