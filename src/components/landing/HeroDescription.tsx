
import { useState, useEffect } from "react";

type HeroDescriptionProps = {
  fullText: string;
}

const HeroDescription = ({ fullText }: HeroDescriptionProps) => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  
  useEffect(() => {
    if (textIndex < fullText.length) {
      const typingTimer = setTimeout(() => {
        setTypedText(fullText.substring(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, 40); // Adjust typing speed
      return () => clearTimeout(typingTimer);
    }
  }, [textIndex, fullText]);

  return (
    <div className="h-24 mb-10">
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
        {typedText}
        <span className="animate-blink">|</span>
      </p>
    </div>
  );
};

export default HeroDescription;
