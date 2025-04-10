
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

  // Animate the letters of "Zepmeds"
  const titleText = "Zepmeds";
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.5 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0a0a1f] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="mb-8 z-10 relative"
        >
          <h1 className="text-4xl font-bold mb-2 text-gradient-primary inline-flex">
            {titleText.split('').map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
                style={{ color: index % 2 === 0 ? '#9b87f5' : '#ffffff' }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <div className="h-64 w-full mb-8 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -top-8 -left-8 w-16 h-16 bg-purple-500/20 rounded-full"
            />
            
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0, 5, 0],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
              className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-500/20 rounded-full"
            />
            
            <motion.div
              className="w-32 h-32 rounded-full bg-zepmeds-purple/20 flex items-center justify-center z-10 relative"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
                className="flex items-center justify-center"
              >
                <motion.span className="text-7xl">💊</motion.span>
              </motion.div>
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
          
          <div className="grid grid-cols-3 gap-2 mt-4 mb-6">
            <LinkButton icon="💰" name="Wallet" path="/wallet" />
            <LinkButton icon="🎁" name="Offers" path="/offers" />
            <LinkButton icon="🎫" name="Coupons" path="/coupons" />
            <LinkButton icon="❓" name="Help" path="/help" />
            <LinkButton icon="📞" name="Support" path="/support" />
          </div>
          
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

const LinkButton = ({ icon, name, path }: { icon: string; name: string; path: string }) => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
      onClick={() => navigate(path)}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs text-gray-300">{name}</span>
    </motion.button>
  );
};

export default Index;
