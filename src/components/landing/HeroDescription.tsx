
import { useState, useEffect, useMemo, memo } from "react";

type HeroDescriptionProps = {
  fullText: string;
  typingSpeed?: number;
  className?: string;
}

const HeroDescription = memo(({ 
  fullText, 
  typingSpeed = 40, 
  className = "text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed" 
}: HeroDescriptionProps) => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  
  // Memoize any text processing operations
  const processedText = useMemo(() => {
    // This would be where more complex processing could happen
    // For example, formatting, cleaning, or optimizing the text
    return fullText.trim();
  }, [fullText]);
  
  useEffect(() => {
    if (textIndex < processedText.length) {
      const typingTimer = setTimeout(() => {
        setTypedText(processedText.substring(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, typingSpeed); // Adjustable typing speed
      return () => clearTimeout(typingTimer);
    }
  }, [textIndex, processedText, typingSpeed]);

  return (
    <div className="h-24 mb-10" role="region" aria-label="Description">
      <p className={className}>
        {typedText}
        <span className="animate-blink" aria-hidden="true">|</span>
      </p>
    </div>
  );
});

// Add display name for easier debugging
HeroDescription.displayName = "HeroDescription";

export default HeroDescription;
