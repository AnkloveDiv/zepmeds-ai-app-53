
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Check if user is already logged in
      setTimeout(() => {
        if (isLoggedIn) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      }, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0a0a1f] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-8 z-10 relative"
        >
          <h1 className="text-4xl font-bold mb-2 text-gradient-primary">
            Zepmeds
          </h1>
          <p className="text-gray-400">Medicines at your doorstep</p>
        </motion.div>

        <div className="h-64 w-full mb-8 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="p-6 rounded-full bg-zepmeds-purple/20 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="text-6xl text-zepmeds-purple"
            >
              💊
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-300 mb-4"
          >
            Your health, our priority
          </motion.p>
          
          {!isLoggedIn && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-zepmeds-purple hover:bg-zepmeds-purple-light text-white font-medium py-3 px-6 rounded-full transition-colors"
              onClick={() => navigate("/login")}
            >
              Get Started
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
