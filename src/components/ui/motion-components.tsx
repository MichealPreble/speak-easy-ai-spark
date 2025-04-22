
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// MotionHover: scales and changes opacity on hover
interface MotionHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: number;
  opacity?: number;
  children: React.ReactNode;
  className?: string;
}
export const MotionHover: React.FC<MotionHoverProps> = ({
  children,
  scale = 1.06,
  opacity = 0.96,
  className = "",
  ...props
}) => (
  <motion.div
    whileHover={{
      scale,
      opacity,
      transition: { type: "spring", stiffness: 220, damping: 14 },
    }}
    whileTap={{ scale: scale - 0.03 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// MotionFade: fade-in/fade-out wrapper
interface MotionFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}
export const MotionFade: React.FC<MotionFadeProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  className = "",
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0, transition: { delay, duration } }}
    exit={{ opacity: 0, y: 8, transition: { duration: duration / 2 } }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// MotionListItem: fade/slide list entry with index-based stagger
interface MotionListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  index?: number;
  children: React.ReactNode;
  className?: string;
}
export const MotionListItem: React.FC<MotionListItemProps> = ({
  children,
  index = 0,
  className = "",
  ...props
}) => (
  <AnimatePresence>
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.06 } }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.16 } }}
      className={className}
      {...props}
    >
      {children}
    </motion.li>
  </AnimatePresence>
);
