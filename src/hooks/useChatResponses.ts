
import { useMemo, useState } from "react";

/**
 * Hook for generating AI speech coach responses with scenario support
 */
export function useChatResponses({ selectedScenario }: { selectedScenario?: string | null } = {}) {
  // Track speech writing progress
  const [speechWritingState, setSpeechWritingState] = useState({
    step: 'initial',
    topic: '',
    audience: '',
    story: '',
  });

  // Track scenario practice progress
  const [scenarioState, setScenarioState] = useState({
    step: 'initial',
    hasStarted: false,
  });

  // Public speaking focused response generator - memoized to prevent recreation on re-renders
  const getSimulatedResponse = useMemo(() => {
    return (userInput: string): string => {
      const input = userInput.toLowerCase();
      
      // Handle scenario-specific practice sessions
      if (selectedScenario) {
        // Start practice session when user requests it
        if (input.includes("start practice") && !scenarioState.hasStarted) {
          setScenarioState({ step: 'introduction', hasStarted: true });
          
          switch (selectedScenario) {
            case 'small-team':
              return "Let's practice presenting to a small team! Imagine you're addressing a group of 5-10 colleagues.\n\n**Your Goal**: Deliver a clear, concise presentation that engages your team.\n\n**Step 1**: Start by introducing your topic in an engaging way. For example: 'Today, I'd like to share a strategy that helped our team increase productivity by 20%.'\n\nTry delivering your introduction now!";
              
            case 'conference-keynote':
              return "Let's practice a keynote at a conference! Picture yourself on stage in front of 500 professionals.\n\n**Your Goal**: Captivate and inspire a large audience with your expertise.\n\n**Step 1**: Begin with a powerful opening to grab attention, such as a surprising statistic or personal story. For example: 'Did you know that 75% of people fear public speaking more than death? I used to be one of them.'\n\nDeliver your opening now!";
              
            case 'wedding-toast':
              return "Let's practice a wedding toast! Imagine you're speaking to a room of 100 guests at a wedding reception.\n\n**Your Goal**: Celebrate the couple with warmth, humor, and sincerity.\n\n**Step 1**: Start with a warm, heartfelt opening. For example: 'I've known [Bride/Groom] for 10 years, and I've never seen them as happy as they are today.'\n\nGive your opening a try!";
              
            default:
              return "Let's start practicing! Please deliver your speech, and I'll provide feedback as we go through each section.";
          }
        }

        // Guide user through the different sections of their speech based on current step
        if (scenarioState.hasStarted) {
          if (scenarioState.step === 'introduction') {
            setScenarioState((prev) => ({ ...prev, step: 'body' }));
            
            switch (selectedScenario) {
              case 'small-team':
                return "Great introduction! You've got your team's attention.\n\n**Step 2**: Now, share 2-3 key points with specific examples. Keep it concise and actionable. For example: 'First, we implemented daily stand-ups which improved communication by 40%. Second, we created a shared project tracker that reduced duplicate work.'\n\nTry delivering your key points now!";
                
              case 'conference-keynote':
                return "Powerful opening! You've captured the audience's attention.\n\n**Step 2**: Now, outline the main insights or ideas of your talk with supporting evidence or stories. For example: 'After years of research, I've identified three principles that transformed my speaking career. Let me walk you through each one.'\n\nDeliver your main points now!";
                
              case 'wedding-toast':
                return "Wonderful start! You've set a warm tone.\n\n**Step 2**: Now, share a meaningful story or memory about the couple. Focus on a moment that highlights their relationship. For example: 'I'll never forget the time [Bride/Groom] called me at midnight because [Partner] was stranded with a flat tire, and they drove 30 miles just to help.'\n\nShare your story now!";
                
              default:
                return "Nice start! Now, continue with the main part of your speech where you'll elaborate on your key points.";
            }
          } 
          else if (scenarioState.step === 'body') {
            setScenarioState((prev) => ({ ...prev, step: 'conclusion' }));
            
            switch (selectedScenario) {
              case 'small-team':
                return "Those are clear, actionable points - perfect for a team presentation!\n\n**Step 3**: Now, wrap up with a strong conclusion and call to action. For example: 'Let's implement these strategies this week. I'll send a follow-up email with action items, and we can review progress next Friday.'\n\nDeliver your conclusion now!";
                
              case 'conference-keynote':
                return "Excellent insights - very informative!\n\n**Step 3**: Now, conclude your keynote with a memorable closing that ties back to your opening and inspires action. For example: 'Remember the fear statistic I mentioned? Today, you've learned how to transform that fear into power. I challenge you to practice one technique daily for the next week.'\n\nDeliver your conclusion now!";
                
              case 'wedding-toast':
                return "That's a touching story that really captures their relationship!\n\n**Step 3**: Now, close your toast with a heartfelt wish for the couple's future. For example: 'As we raise our glasses, I wish [Bride] and [Groom] a lifetime filled with the same love, laughter, and support that has brought them to this beautiful day. To the happy couple!'\n\nDeliver your closing toast now!";
                
              default:
                return "You've made some compelling points! Now, wrap up your speech with a strong conclusion that reinforces your message.";
            }
          } 
          else if (scenarioState.step === 'conclusion') {
            setScenarioState({ step: 'initial', hasStarted: false });
            
            switch (selectedScenario) {
              case 'small-team':
                return "**Practice Complete!** 👏\n\n**Strengths**:\n✓ You structured your team presentation effectively\n✓ Your call to action was clear and actionable\n✓ You kept the message concise and focused\n\n**Tips for Improvement**:\n• Consider adding brief data points to support your key points\n• Practice strategic pauses after important statements\n• Add a personal anecdote to build connection with your team\n\nWould you like to try another scenario or practice a specific part again?";
                
              case 'conference-keynote':
                return "**Practice Complete!** 👏\n\n**Strengths**:\n✓ Your opening grabbed attention effectively\n✓ Your content showed expertise on the subject\n✓ Your conclusion tied everything together nicely\n\n**Tips for Improvement**:\n• Practice varying your vocal tone between sections\n• Consider adding a rhetorical question to engage the audience\n• Include a brief personal story to build credibility\n\nWould you like to try another scenario or practice a specific part again?";
                
              case 'wedding-toast':
                return "**Practice Complete!** 👏\n\n**Strengths**:\n✓ Your toast struck the perfect balance of heartfelt and celebratory\n✓ Your story about the couple was meaningful and relevant\n✓ Your closing wish was sincere and uplifting\n\n**Tips for Improvement**:\n• Consider adding a touch of appropriate humor\n• Practice slowing down during emotional moments\n• Keep eye contact with both the couple and guests\n\nWould you like to try another scenario or practice a specific part again?";
                
              default:
                return "**Practice Complete!** 👏\n\nYou've successfully delivered a complete speech with all key components. Remember to practice regularly to build confidence and refine your delivery. Would you like to try a specific scenario or focus on a particular speaking skill?";
            }
          }
        }
      }
      
      // Handle general public speaking queries
      if (input.includes("hello") || input.includes("hi")) {
        return "Hello! I'm your public speaking assistant. I can help you practice speeches, structure your presentations, and provide feedback on your delivery. How would you like to improve your speaking skills today?";
      } 
      else if (input.includes("help") || input.includes("what can you do")) {
        return "I can help with several aspects of public speaking:\n\n* Speech structure and content\n* Delivery techniques\n* Personal story integration\n* Practice with feedback\n* Confidence building\n\nJust let me know what you'd like to work on!";
      }
      else if (input.includes("nervous") || input.includes("anxiety") || input.includes("afraid")) {
        return "Public speaking anxiety is common, even among experienced speakers. Try these techniques:\n\n1. **Practice regularly** in a safe environment\n2. *Visualize* successful presentations\n3. Focus on your *audience's needs* rather than yourself\n4. Start with *deep breathing* before speaking\n\nRemember, even professional speakers get nervous - they've just learned to channel that energy positively.";
      }
      else if (input.includes("write speech")) {
        setSpeechWritingState({ step: 'topic', topic: '', audience: '', story: '' });
        return "Let's write a speech together! What's the topic of your speech, and who is your audience?";
      }
      else if (input.includes("topic") || input.includes("audience")) {
        setSpeechWritingState((prev) => ({
          ...prev,
          step: 'story',
          topic: userInput.includes('topic') ? userInput : prev.topic,
          audience: userInput.includes('audience') ? userInput : prev.audience,
        }));
        return "Great! To make your speech more engaging, let's add a personal story. Can you share a personal experience related to this topic?";
      }
      else if (input.includes("story") || input.includes("personal") || input.includes("anecdote")) {
        setSpeechWritingState((prev) => ({
          ...prev,
          step: 'final',
          story: userInput,
        }));
        return `Thanks for sharing! Here's a draft of your speech:\n\n**Introduction**: Start with your story to grab attention.\n- ${userInput}\n\n**Body**: Explain the lesson or insight from your story.\n- [Add your main points here]\n\n**Conclusion**: Tie it back to your audience and end with a call to action.\n- [Add your closing thoughts]\n\nFeel free to edit this draft!`;
      }
      else if (input.includes("structure") || input.includes("organize") || input.includes("outline")) {
        return "A well-structured speech typically follows this pattern:\n\n1. **Strong opening**: Grab attention with a question, story, or startling fact\n2. **Clear thesis**: State your main point/purpose\n3. **Supporting points**: 2-4 main arguments with evidence\n4. **Personal stories**: Include relevant experiences to connect emotionally\n5. **Call to action**: Tell the audience what to do next\n6. **Memorable conclusion**: Circle back to your opening\n\nWhich part would you like help developing?";
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
  }, [selectedScenario, scenarioState, speechWritingState]);

  return {
    getSimulatedResponse
  };
}
