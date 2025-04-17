
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
  speechTypes?: string[];
}

const HeroDescription = memo(({ 
  fullText, 
  typingSpeed = 40, 
  className = "text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed",
  startDelay = 0,
  cursor = "|",
  cursorClassName = "animate-blink",
  height = "h-24",
  withMountAnimation = false,
  speechTypes
}: HeroDescriptionProps) => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!withMountAnimation);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  
  // Memoize any text processing operations
  const processedText = useMemo(() => {
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

  // Handle rotating through speech types if provided
  useEffect(() => {
    if (speechTypes && speechTypes.length > 0) {
      const rotationInterval = setInterval(() => {
        setCurrentTypeIndex((prevIndex) => (prevIndex + 1) % speechTypes.length);
      }, 3000); // Change every 3 seconds
      
      return () => clearInterval(rotationInterval);
    }
  }, [speechTypes]);

  const containerClasses = useMemo(() => {
    return `${height} mb-10 ${withMountAnimation ? 'transition-opacity duration-500 ease-in-out' : ''} ${withMountAnimation && !isVisible ? 'opacity-0' : 'opacity-100'}`;
  }, [height, withMountAnimation, isVisible]);

  return (
    <div className={containerClasses} role="region" aria-label="Description">
      <p className={className}>
        {typedText}
        <span className={cursorClassName} aria-hidden="true">{cursor}</span>
      </p>
      
      {speechTypes && speechTypes.length > 0 && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-lg font-medium mb-2">Perfect for:</p>
          <div className="relative h-8 overflow-hidden w-full max-w-xs text-center">
            {speechTypes.map((type, index) => (
              <div 
                key={type}
                className="absolute w-full transition-all duration-500 ease-in-out"
                style={{
                  opacity: currentTypeIndex === index ? 1 : 0,
                  transform: `translateY(${currentTypeIndex === index ? 0 : '20px'})`,
                }}
              >
                <span className="text-primary font-bold">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// Add display name for easier debugging
HeroDescription.displayName = "HeroDescription";

export default HeroDescription;
