
import React from 'react';
import { motion } from 'framer-motion';

interface WeatherAnimationProps {
  type: 'sunny' | 'rainy' | 'cloudy';
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ type }) => {
  if (type === 'sunny') {
    return (
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0 pointer-events-none">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute bg-yellow-300 rounded-full opacity-10"
            style={{
              width: `${50 + index * 20}px`,
              height: `${50 + index * 20}px`,
              top: `${20 + index * 10}px`,
              right: `${30 + index * 40}px`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.5,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-transparent"></div>
      </div>
    );
  } else if (type === 'rainy') {
    return (
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-transparent"></div>
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute bg-blue-300 rounded-full opacity-40"
            style={{
              width: '2px',
              height: `${Math.random() * 10 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `-20px`,
            }}
            animate={{ y: 200 }}
            transition={{
              duration: Math.random() * 0.5 + 0.7,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 2,
            }}
          />
        ))}
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={`cloud-${index}`}
            className="absolute bg-gray-400 rounded-full opacity-20"
            style={{
              width: `${80 + index * 20}px`,
              height: `${40 + index * 10}px`,
              top: `${10 + index * 15}px`,
              left: `${index * 30}%`,
            }}
            animate={{
              x: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 1,
            }}
          />
        ))}
      </div>
    );
  } else {
    return (
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 to-transparent"></div>
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute bg-white rounded-full opacity-30"
            style={{
              width: `${60 + index * 20}px`,
              height: `${30 + index * 5}px`,
              left: `${(index * 30) - 20}px`,
              top: `${20 + index * 15}px`,
            }}
            animate={{
              x: [0, 20, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.5,
            }}
          />
        ))}
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={`cloud2-${index}`}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: `${70 + index * 30}px`,
              height: `${35 + index * 10}px`,
              right: `${(index * 25) - 10}px`,
              top: `${40 + index * 20}px`,
            }}
            animate={{
              x: [0, -15, 0],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.7,
            }}
          />
        ))}
      </div>
    );
  }
};

export default WeatherAnimation;
