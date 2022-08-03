import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedContainer({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{
        type: 'tween',
        ease: 'anticipate',
        duration: 0.7,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
