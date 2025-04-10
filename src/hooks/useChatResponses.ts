
import { useMemo } from "react";

/**
 * Hook for generating AI speech coach responses
 */
export function useChatResponses() {
  // Public speaking focused response generator - memoized to prevent recreation on re-renders
  const getSimulatedResponse = useMemo(() => {
    return (userInput: string): string => {
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
        return "Here's a summary of our public speaking session:\n\nWe've discussed techniques for effective public speaking, including structure, delivery, and audience engagement. Remember that great speaking comes from practice, authenticity, and connecting with your audience.\n\nIs there a specific aspect you'd like to focus on in our next practice session?";
      }
      else if (input.includes("thank")) {
        return "You're welcome! Remember, great public speaking comes with consistent practice. Is there anything else you'd like to work on for your next presentation? 😊";
      }
      else {
        return "That's an interesting aspect of public speaking to explore. Once I'm connected to my AI brain, I'll be able to give you more specific guidance. For now, try asking about speech structure, storytelling techniques, audience engagement, or delivery methods. You can also use the voice feature to practice your speech and get feedback.";
      }
    };
  }, []);

  return {
    getSimulatedResponse
  };
}
