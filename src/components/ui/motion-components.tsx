
import React from "react";
import { motion, AnimatePresence, HTMLMotionProps, HTMLMotionLiProps } from "framer-motion";

// MotionHover: scales and changes opacity on hover
type MotionHoverProps = HTMLMotionProps<"div"> & {
  scale?: number;
  opacity?: number;
};
export const MotionHover: React.FC<MotionHoverProps> = ({
  children,
  scale = 1.06,
  opacity = 0.96,
  ...props
}) => (
  <motion.div
    whileHover={{
      scale,
      opacity,
      transition: { type: "spring", stiffness: 220, damping: 14 },
    }}
    whileTap={{ scale: scale - 0.03 }}
    {...props}
  >
    {children}
  </motion.div>
);

// MotionFade: fade-in/fade-out wrapper
type MotionFadeProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
};
export const MotionFade: React.FC<MotionFadeProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0, transition: { delay, duration } }}
    exit={{ opacity: 0, y: 8, transition: { duration: duration / 2 } }}
    {...props}
  >
    {children}
  </motion.div>
);

// MotionListItem: fade/slide list entry with index-based stagger
type MotionListItemProps = HTMLMotionLiProps<"li"> & {
  index?: number;
};

export const MotionListItem: React.FC<MotionListItemProps> = ({
  children,
  index = 0,
  ...props
}) => (
  <AnimatePresence>
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.06 } }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.16 } }}
      {...props}
    >
      {children}
    </motion.li>
  </AnimatePresence>
);

