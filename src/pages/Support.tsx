
import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import MainSupportView from "@/components/support/MainSupportView";
import SupportChat from "@/components/support/SupportChat";
import OpenSourceChat from "@/components/support/OpenSourceChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Support = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "opensource">("ai");
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Help & Support" showBackButton />
      
      <main className="px-4 py-4">
        {!chatOpen ? (
          <MainSupportView onOpenChat={() => setChatOpen(true)} />
        ) : (
          <div className="flex flex-col h-[calc(100vh-180px)]">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "ai" | "opensource")}
              className="mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-white">Support Chat</h2>
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="ai" className="data-[state=active]:bg-zepmeds-purple">
                    AI Assistant
                  </TabsTrigger>
                  <TabsTrigger value="opensource" className="data-[state=active]:bg-zepmeds-purple">
                    Live Chat
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="ai" className="h-full">
                <SupportChat onBack={() => setChatOpen(false)} />
              </TabsContent>
              
              <TabsContent value="opensource" className="h-full">
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <button 
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      onClick={() => setChatOpen(false)}
                    >
                      ← Back to Support
                    </button>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                      Beta Feature
                    </span>
                  </div>
                  <div className="flex-1">
                    <OpenSourceChat />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Support;
