
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is already logged in
      setTimeout(() => {
        if (isLoggedIn) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      }, 3000);
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
        staggerChildren: 0.2
      }
    }
  };
  
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.5,
      rotateY: 90
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0a0a1f] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center flex flex-col items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="mb-8 z-10 relative"
        >
          <h1 className="text-6xl font-bold mb-2 text-gradient-primary inline-flex">
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

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-white text-xl font-medium"
        >
          India's First Fastest Medicine Delivery App
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
