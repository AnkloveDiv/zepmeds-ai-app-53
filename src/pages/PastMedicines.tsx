
import React from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import PastMedicationLog from "@/components/activity/PastMedicationLog";
import useBackNavigation from "@/hooks/useBackNavigation";

const PastMedicines = () => {
  // Use the back navigation hook for proper back button behavior
  useBackNavigation();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Past Medications" showBackButton />

      <main className="px-4 py-4">
        <PastMedicationLog />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default PastMedicines;
