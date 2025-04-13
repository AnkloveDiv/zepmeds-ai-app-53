
import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import MainSupportView from "@/components/support/MainSupportView";
import SupportChat from "@/components/support/SupportChat";

const Support = () => {
  const [chatOpen, setChatOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Help & Support" showBackButton />
      
      <main className="px-4 py-4">
        {!chatOpen ? (
          <MainSupportView onOpenChat={() => setChatOpen(true)} />
        ) : (
          <SupportChat onBack={() => setChatOpen(false)} />
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Support;
