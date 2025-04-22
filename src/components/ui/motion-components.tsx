
import React, { forwardRef } from 'react';
import { motion, useMotionValue, useTransform, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- MotionHover.tsx ---
interface MotionHoverProps extends HTMLMotionProps<'div'> {
    scale?: number;
    opacity?: number;
}

const MotionHover = forwardRef<HTMLDivElement, MotionHoverProps>(({
    scale = 1.06,
    opacity = 0.96,
    ...props
}, ref) => {
    const motionValue = useMotionValue(1);
    const targetScale = typeof scale === 'number' ? scale : 1.06;
    const targetOpacity = typeof opacity === 'number' ? opacity : 0.96;

    const style = {
        scale: useTransform(motionValue, (val) => val * targetScale),
        opacity: useTransform(motionValue, (val) => val * targetOpacity),
    };

    return (
        <motion.div
            ref={ref}
            style={style}
            initial={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.06, opacity: 0.96 }}
            whileTap={{ scale: scale - 0.03 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            {...props}
        >
            {props.children}
        </motion.div>
    );
});

MotionHover.displayName = 'MotionHover';


// --- MotionFade.tsx ---
interface MotionFadeProps extends HTMLMotionProps<'div'> {
    delay?: number;
    duration?: number;
}

const MotionFade = forwardRef<HTMLDivElement, MotionFadeProps>(({
    delay = 0,
    duration = 0.4,
    ...props
}, ref) => {
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay, duration } }}
            exit={{ opacity: 0, y: 8, transition: { duration: duration / 2 } }}
            {...props}
        >
            {props.children}
        </motion.div>
    );
});

MotionFade.displayName = 'MotionFade';

// --- MotionListItem.tsx ---
interface MotionListItemProps extends HTMLMotionProps<'li'> {
    index?: number;
}

const MotionListItem = forwardRef<HTMLLIElement, MotionListItemProps>(({
    index = 0,
    ...props
}, ref) => {
    return (
        <AnimatePresence>
            <motion.li
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.06 } }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.16 } }}
                {...props}
            >
                {props.children}
            </motion.li>
        </AnimatePresence>
    );
});

MotionListItem.displayName = 'MotionListItem';

export { MotionHover, MotionFade, MotionListItem };
