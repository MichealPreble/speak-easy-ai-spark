
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface SpeechTipsProps {
  tips: string[];
  duration: number;
}

const SpeechTips: React.FC<SpeechTipsProps> = ({ tips, duration }) => {
  return (
    <AnimatePresence>
      {tips.length > 0 && (
        <div className="p-3 border-t border-border/30">
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
        </div>
      )}
      
      {tips.length === 0 && duration > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 border-t border-border/30"
        >
          <div className="flex items-start text-sm">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>You're doing great! Keep speaking naturally.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechTips;
