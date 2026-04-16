import React from "react";
import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <motion.div
      style={{
        width: 20,
        height: 20,
        border: "4px solid #ccc",
        borderTop: "4px solid #333",
        borderRadius: "50%",
      }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 1,
      }}
    />
  );
};

export default Spinner;
