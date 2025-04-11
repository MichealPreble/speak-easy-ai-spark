
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const PositiveFeedback: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-start text-sm"
    >
      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
      <span>You're doing great! Keep speaking naturally.</span>
    </motion.div>
  );
};

export default PositiveFeedback;
