import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecognition, SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMessageStore } from "@/hooks/useMessageStore";
import { useMessageSearch } from "@/hooks/useMessageSearch";
import { useChatUI } from "@/hooks/useChatUI";
import { useAnalytics } from "@/hooks/useAnalytics";

export const useChat = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Use our specialized hooks
  const { messages, setMessages, clearMessages } = useMessageStore();
  const { searchQuery, setSearchQuery, filteredMessages } = useMessageSearch(messages);
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const { speak } = useSpeechSynthesis();
  const { 
    inputRef, 
    scrollAreaRef, 
    scrollToBottom, 
    showTyping,
    showTypingIndicator 
  } = useChatUI(messages);
  const analytics = useAnalytics();

  // Public speaking focused response generator
  const getSimulatedResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! I'm your public speaking assistant. I can help you practice speeches, structure your presentations, and provide feedback on your delivery. How would you like to improve your speaking skills today?";
    } 
    else if (input.includes("help") || input.includes("what can you do")) {
      return "I can help with several aspects of public speaking:\n\n* Speech structure and content\n* Delivery techniques\n* Personal story integration\n* Practice with feedback\n* Confidence building\n\nJust let me know what you'd like to work on!";
    }
    else if (input.includes("nervous") || input.includes("anxiety") || input.includes("afraid")) {
      return "Public speaking anxiety is common, even among experienced speakers. Try these techniques:\n\n1. **Practice regularly** in a safe environment\n2. *Visualize* successful presentations\n3. Focus on your *audience's needs* rather than yourself\n4. Start with *deep breathing* before speaking\n\nRemember, even professional speakers get nervous - they've just learned to channel that energy positively.";
    }
    else if (input.includes("structure") || input.includes("organize") || input.includes("outline")) {
      return "A well-structured speech typically follows this pattern:\n\n1. **Strong opening**: Grab attention with a question, story, or startling fact\n2. **Clear thesis**: State your main point/purpose\n3. **Supporting points**: 2-4 main arguments with evidence\n4. **Personal stories**: Include relevant experiences to connect emotionally\n5. **Call to action**: Tell the audience what to do next\n6. **Memorable conclusion**: Circle back to your opening\n\nWhich part would you like help developing?";
    }
    else if (input.includes("story") || input.includes("personal") || input.includes("anecdote")) {
      return "Personal stories make your speeches memorable and relatable. For effective storytelling:\n\n1. Choose stories that **directly relate** to your main message\n2. Include *specific details* that engage the senses\n3. Keep stories *concise* (30-90 seconds typically)\n4. Highlight the *emotional turning point*\n5. Explicitly connect the story to your main point\n\nWould you like to practice crafting a personal story for your next speech?";
    }
    else if (input.includes("feedback") || input.includes("how did i do") || input.includes("review")) {
      return "Based on your voice message, I noticed these positive aspects:\n\n✓ Your pace was generally good\n✓ Your voice had natural variation in tone\n✓ Your message was clearly structured\n\nSome areas for improvement:\n\n* Consider reducing filler words like 'um' and 'uh'\n* Try pausing more deliberately to emphasize key points\n* The conclusion could be stronger to leave a lasting impression\n\nOverall, you're demonstrating solid speaking skills. Keep practicing!";
    }
    else if (input.includes("voice") || input.includes("tone") || input.includes("delivery")) {
      return "Your voice is a powerful tool for engaging your audience. Consider these delivery techniques:\n\n1. **Vary your pace**: Slow down for important points, speed up for excitement\n2. **Strategic pauses**: Use silence to emphasize key moments\n3. **Volume control**: Speak loudly for emphasis, softly for intimacy\n4. **Pitch variation**: Avoid monotone delivery by changing your vocal tone\n\nThe best speakers sound conversational while being deliberate about these vocal elements.";
    }
    else if (input.includes("audience") || input.includes("engage") || input.includes("connect")) {
      return "To better connect with your audience:\n\n1. **Research their interests** and pain points beforehand\n2. **Make eye contact** with different sections of the room\n3. **Ask rhetorical questions** to provoke thought\n4. **Use inclusive language** like 'we' and 'our'\n5. **Share relevant stories** that resonate with their experiences\n\nRemember that audiences want you to succeed - they're on your side!";
    }
    else if (input.includes("summarize")) {
      // Create a focused summary of the conversation
      const userMessages = messages.filter(m => m.sender === "user");
      if (userMessages.length <= 1) {
        return "We've just started our conversation about public speaking. Ask me about speech structure, delivery techniques, storytelling, or audience engagement to get specific guidance for your next presentation.";
      }
      
      return "Here's a summary of our public speaking session:\n\n" + 
             userMessages.slice(0, 5).map(m => `- We discussed ${m.text.substring(0, 50)}${m.text.length > 50 ? '...' : ''}`).join('\n') + 
             "\n\nWould you like specific advice on any of these topics, or should we practice something new?";
    }
    else if (input.includes("thank")) {
      return "You're welcome! Remember, great public speaking comes with consistent practice. Is there anything else you'd like to work on for your next presentation? 😊";
    }
    else {
      return "That's an interesting aspect of public speaking to explore. Once I'm connected to my AI brain, I'll be able to give you more specific guidance. For now, try asking about speech structure, storytelling techniques, audience engagement, or delivery methods. You can also use the voice feature to practice your speech and get feedback.";
    }
  };

  // Generate feedback based on speech analysis
  const generateSpeechFeedback = (feedback: SpeechFeedback): string => {
    const { speed, duration, fillerWords, wordCount } = feedback;
    
    let feedbackText = "## Speech Analysis\n\n";
    
    // Speaking rate feedback
    if (speed > 0) {
      feedbackText += `• **Speaking rate**: ${speed} words per minute\n`;
      if (speed < 120) {
        feedbackText += "  You're speaking a bit slowly, which can be good for emphasis but might lose audience attention if maintained throughout. Consider varying your pace.\n\n";
      } else if (speed > 180) {
        feedbackText += "  You're speaking quite rapidly, which shows enthusiasm but might make it difficult for your audience to follow. Try slowing down for key points.\n\n";
      } else {
        feedbackText += "  Your speaking rate is in an ideal range for clear comprehension. Well done!\n\n";
      }
    }
    
    // Filler words feedback
    if (fillerWords.length > 0) {
      const fillerFrequency = fillerWords.length / (duration / 60); // Fillers per minute
      feedbackText += `• **Filler words**: ${fillerWords.join(", ")}\n`;
      if (fillerFrequency > 5) {
        feedbackText += "  You're using quite a few filler words, which can distract from your message. Practice replacing them with strategic pauses.\n\n";
      } else if (fillerFrequency > 0) {
        feedbackText += "  You have a few filler words, but they're not overly distracting. Being aware of them is the first step to reducing them.\n\n";
      }
    } else {
      feedbackText += "• **Filler words**: None detected! Excellent job avoiding filler words.\n\n";
    }
    
    // Duration feedback
    feedbackText += `• **Duration**: ${duration} seconds (${wordCount} words)\n`;
    if (duration < 10) {
      feedbackText += "  Your message was quite brief. For practicing a speech, try a longer segment to demonstrate your pacing and structure.\n\n";
    } else if (duration > 60) {
      feedbackText += "  You delivered a substantial message. Great job maintaining your flow for an extended period.\n\n";
    } else {
      feedbackText += "  Good length for a practice segment. You provided enough content to demonstrate your speaking style.\n\n";
    }
    
    // Overall feedback and tips
    feedbackText += "### Next Steps\n";
    if (fillerWords.length > 0) {
      feedbackText += "• Practice replacing filler words with pauses\n";
    }
    if (speed < 120 || speed > 180) {
      feedbackText += "• Work on varying your speaking pace for different parts of your speech\n";
    }
    feedbackText += "• Record yourself and listen for vocal variety\n";
    feedbackText += "• Practice with a timer to develop a sense for timing\n";
    
    return feedbackText;
  };

  // Handle voice message send
  const handleSendVoice = (transcript: string, speechFeedback: SpeechFeedback) => {
    if (!transcript.trim()) return;
    
    // Track voice message event
    analytics.trackVoiceMessage();
    
    const userMessage: Message = {
      id: Date.now(),
      text: transcript,
      sender: "user",
      timestamp: new Date(),
      isVoiceMessage: true
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Show typing indicator before AI responds
    showTyping(1500);

    // Simulate bot response (will be replaced with actual API call later)
    setTimeout(() => {
      const botResponse = getSimulatedResponse(transcript);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      // Only add feedback for longer messages that are actually speech practice
      let messages = [botMessage];
      
      if (transcript.length > 30 || speechFeedback.duration > 5) {
        const feedbackText = generateSpeechFeedback(speechFeedback);
        const feedbackMessage: Message = {
          id: Date.now() + 2,
          text: feedbackText,
          sender: "bot",
          timestamp: new Date(),
          isFeedback: true
        };
        messages.push(feedbackMessage);
      }
      
      setMessages((prev) => [...prev, ...messages]);
      setIsLoading(false);
      
      // Speak the response
      speak(botResponse);
    }, 1500);
  };

  // Handle text message send
  const handleSendMessage = (text = input) => {
    if (!text.trim() || isLoading) return;

    // Track text message event
    analytics.trackMessageSent();

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Show typing indicator before AI responds
    showTyping(1500);

    // Simulate bot response (will be replaced with actual API call later)
    setTimeout(() => {
      const botResponse = getSimulatedResponse(text);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Set up voice recognition
  const { isVoiceActive, toggleVoice } = useVoiceRecognition(handleSendVoice);

  // Summarize the conversation
  const summarize = () => {
    analytics.trackSummarize();
    handleSendMessage("summarize");
  };

  // Handle theme toggling with analytics
  const handleToggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    analytics.trackThemeToggle(newTheme);
    toggleDarkMode();
  };

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onVoiceToggle: toggleVoice,
    onSummarize: summarize
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleClearChat = () => {
    analytics.trackClearChat();
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "All previous messages have been removed.",
    });
  };

  // Track search usage
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      analytics.trackSearchUsed();
    }
  }, [searchQuery]);

  return {
    messages,
    filteredMessages,
    input,
    setInput,
    isLoading,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode: handleToggleDarkMode,
    isVoiceActive,
    inputRef,
    scrollAreaRef,
    handleSend: handleSendMessage,
    handleClearChat,
    toggleVoice,
    summarize,
    showTypingIndicator
  };
};
