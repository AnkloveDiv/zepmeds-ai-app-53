
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { WeeklyStatsGraph } from "@/components/activity/WeeklyStatsGraph";
import HealthMetricsLogger from "@/components/activity/HealthMetricsLogger";
import PastMedicationLog from "@/components/activity/PastMedicationLog";

const Activity = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Activity" />
      
      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <WeeklyStatsGraph />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Log Health Metrics</h2>
          <HealthMetricsLogger />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-morphism rounded-xl p-4"
        >
          <PastMedicationLog />
        </motion.div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Activity;
