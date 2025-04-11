
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { WeeklyStatsGraph } from "@/components/activity/WeeklyStatsGraph";
import HealthMetricsLogger from "@/components/activity/HealthMetricsLogger";
import PastMedicationLog from "@/components/activity/PastMedicationLog";
import TrackOrderButton from "@/components/order/TrackOrderButton";

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
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <PastMedicationLog />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-morphism rounded-xl p-4 bg-gradient-to-br from-zepmeds-purple/20 to-purple-400/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-medium mb-1">Track Your Orders</h3>
              <p className="text-gray-300">Check the status of your medicine deliveries</p>
            </div>
            <TrackOrderButton 
              variant="outline"
              className="border-zepmeds-purple text-zepmeds-purple bg-white/10 hover:bg-white/20"
            />
          </div>
        </motion.div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Activity;
