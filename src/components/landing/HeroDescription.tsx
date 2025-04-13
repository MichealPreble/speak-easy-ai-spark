
import { useState, useEffect, useMemo, memo } from "react";

type HeroDescriptionProps = {
  fullText: string;
  typingSpeed?: number;
  className?: string;
  startDelay?: number;
  cursor?: string;
  cursorClassName?: string;
  height?: string;
  withMountAnimation?: boolean;
}

const HeroDescription = memo(({ 
  fullText, 
  typingSpeed = 40, 
  className = "text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed",
  startDelay = 0,
  cursor = "|",
  cursorClassName = "animate-blink",
  height = "h-24",
  withMountAnimation = false
}: HeroDescriptionProps) => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!withMountAnimation);
  
  // Memoize any text processing operations
  const processedText = useMemo(() => {
    // This would be where more complex processing could happen
    // For example, formatting, cleaning, or optimizing the text
    return fullText.trim();
  }, [fullText]);
  
  // Handle animation on mount if enabled
  useEffect(() => {
    if (withMountAnimation) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [withMountAnimation]);
  
  // Handle the typing effect
  useEffect(() => {
    if (textIndex < processedText.length && isVisible) {
      const initialDelay = textIndex === 0 ? startDelay : 0;
      
      const typingTimer = setTimeout(() => {
        setTypedText(processedText.substring(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, initialDelay + typingSpeed); // Adjustable typing speed with initial delay
      
      return () => clearTimeout(typingTimer);
    }
  }, [textIndex, processedText, typingSpeed, startDelay, isVisible]);

  const containerClasses = useMemo(() => {
    return `${height} mb-10 ${withMountAnimation ? 'transition-opacity duration-500 ease-in-out' : ''} ${withMountAnimation && !isVisible ? 'opacity-0' : 'opacity-100'}`;
  }, [height, withMountAnimation, isVisible]);

  return (
    <div className={containerClasses} role="region" aria-label="Description">
      <p className={className}>
        {typedText}
        <span className={cursorClassName} aria-hidden="true">{cursor}</span>
      </p>
    </div>
  );
});

// Add display name for easier debugging
HeroDescription.displayName = "HeroDescription";

export default HeroDescription;
