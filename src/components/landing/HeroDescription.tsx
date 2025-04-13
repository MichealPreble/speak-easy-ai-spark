
import { useState, useEffect, useMemo, memo } from "react";

type HeroDescriptionProps = {
  fullText: string;
}

const HeroDescription = memo(({ fullText }: HeroDescriptionProps) => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  
  // Memoize any text processing operations
  const processedText = useMemo(() => {
    // This is a simple example, but if we had more complex text processing,
    // this would prevent unnecessary recalculations on re-renders
    return fullText.trim();
  }, [fullText]);
  
  useEffect(() => {
    if (textIndex < processedText.length) {
      const typingTimer = setTimeout(() => {
        setTypedText(processedText.substring(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, 40); // Adjust typing speed
      return () => clearTimeout(typingTimer);
    }
  }, [textIndex, processedText]);

  return (
    <div className="h-24 mb-10">
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
        {typedText}
        <span className="animate-blink">|</span>
      </p>
    </div>
  );
});

// Add display name for easier debugging
HeroDescription.displayName = "HeroDescription";

export default HeroDescription;
