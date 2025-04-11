
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface TipListProps {
  tips: string[];
}

const TipList: React.FC<TipListProps> = ({ tips }) => {
  return (
    <ul className="space-y-2">
      {tips.map((tip, index) => (
        <motion.li
          key={`${tip.substring(0, 10)}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-start text-sm"
        >
          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>{tip}</span>
        </motion.li>
      ))}
    </ul>
  );
};

export default TipList;
