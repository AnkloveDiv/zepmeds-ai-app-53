
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import AnimatedSearchInput from './AnimatedSearchInput';

const AnimatedSearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="w-full"
    >
      <div className="relative w-full">
        <AnimatedSearchInput />
      </div>
    </motion.div>
  );
};

export default AnimatedSearchBar;
