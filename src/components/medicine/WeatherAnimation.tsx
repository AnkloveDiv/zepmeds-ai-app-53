
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
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.5,
            }}
          />
        ))}
      </div>
    );
  } else if (type === 'rainy') {
    return (
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0 pointer-events-none">
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute bg-blue-300 rounded-full opacity-40"
            style={{
              width: '2px',
              height: '10px',
              left: `${Math.random() * 100}%`,
            }}
            initial={{ y: -20 }}
            animate={{ y: 100 }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  } else {
    return (
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0 pointer-events-none">
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
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.5,
            }}
          />
        ))}
      </div>
    );
  }
};

export default WeatherAnimation;
