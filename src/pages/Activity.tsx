
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { motion } from "framer-motion";
import HealthMetricsLogger from "@/components/activity/HealthMetricsLogger";
import WeeklyStatsGraph from "@/components/activity/WeeklyStatsGraph";

const Activity = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Activity" />

      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">Health Tracking</h1>
          <p className="text-gray-400 mb-4">Monitor your health metrics</p>
          
          <HealthMetricsLogger />
          <WeeklyStatsGraph />
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Activity;
