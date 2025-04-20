
import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchMessagesFromSupabase, 
  saveWelcomeMessageToSupabase, 
  saveMessageToSupabase,
  clearMessagesFromSupabase,
  markMessageAsReadInSupabase,
  subscribeToMessages
} from "@/services/messageService";
import { 
  loadMessagesFromLocalStorage, 
  saveMessagesToLocalStorage 
} from "@/services/localStorageService";

export function useMessageStore() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    // Fall back to localStorage if no user is authenticated or Supabase is not configured
    if (!user || !isSupabaseConfigured()) {
      return loadMessagesFromLocalStorage();
    }
    return [];
  });

  // Fetch messages from Supabase when user logs in
  useEffect(() => {
    // Skip if no user or Supabase is not configured
    if (!user || !isSupabaseConfigured()) return;

    const fetchMessages = async () => {
      try {
        const messagesData = await fetchMessagesFromSupabase(user.id);
        
        if (messagesData && messagesData.length > 0) {
          // Properly type-cast the data
          const typedMessages: Message[] = messagesData.map((msg: any) => ({
            id: Number(msg.id),
            text: String(msg.text || ''),
            sender: (String(msg.sender || 'bot') === 'user' ? 'user' : 'bot') as 'user' | 'bot',
            timestamp: new Date(msg.timestamp),
            isVoiceMessage: Boolean(msg.isVoiceMessage),
            isFeedback: Boolean(msg.isFeedback),
            read: Boolean(msg.read)
          }));
          
          setMessages(typedMessages);
        } else {
          // Set initial welcome message if no messages exist
          const welcomeMessage: Message = {
            id: Date.now(),
            text: "Welcome to SpeakEasyAI! I'm your public speaking assistant, ready to help you become a more confident and effective speaker.\n\nI can help you:\n- Structure your speeches\n- Integrate personal stories\n- Improve your delivery\n- Practice with voice recognition and get detailed feedback\n- Build confidence techniques\n\nTry the voice button to record a practice segment and receive analysis on your pace, filler words, and delivery. How would you like to enhance your speaking skills today?",
            sender: "bot",
            timestamp: new Date(),
            read: true
          };
          setMessages([welcomeMessage]);
          
          // Save welcome message to Supabase
          await saveWelcomeMessageToSupabase(user.id, welcomeMessage);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error loading messages",
          description: "There was a problem loading your conversation history.",
          variant: "destructive"
        });
      }
    };

    fetchMessages();

    // Set up real-time subscription if Supabase is configured
    const subscription = subscribeToMessages(user.id, fetchMessages);

    return () => {
      subscription.unsubscribe();
    };
  }, [user, toast]);

  // Save to localStorage if no user is authenticated or Supabase is not configured
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      saveMessagesToLocalStorage(messages);
    }
  }, [messages, user]);

  // Add a message
  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now(),
      timestamp: new Date(),
    };

    // Add to state immediately for UI responsiveness
    setMessages(prev => [...prev, newMessage]);

    // If authenticated and Supabase is configured, save to Supabase
    if (user && isSupabaseConfigured()) {
      try {
        await saveMessageToSupabase(user.id, message);
      } catch (error) {
        toast({
          title: "Error saving message",
          description: "Your message couldn't be saved to the cloud.",
          variant: "destructive"
        });
      }
    }
  };

  // Clear messages
  const clearMessages = async () => {
    const initialMessage: Message = {
      id: Date.now(),
      text: "Welcome to SpeakEasyAI! I'm your public speaking assistant, ready to help you become a more confident and effective speaker.\n\nI can help you:\n- Structure your speeches\n- Integrate personal stories\n- Improve your delivery\n- Practice with voice recognition and get detailed feedback\n- Build confidence techniques\n\nTry the voice button to record a practice segment and receive analysis on your pace, filler words, and delivery. How would you like to enhance your speaking skills today?",
      sender: "bot",
      timestamp: new Date(),
      read: true
    };
    
    // Clear and set initial message in state
    setMessages([initialMessage]);

    // If authenticated and Supabase is configured, clear from Supabase and add initial message
    if (user && isSupabaseConfigured()) {
      try {
        // Delete all existing messages
        await clearMessagesFromSupabase(user.id);
        
        // Add welcome message
        await saveWelcomeMessageToSupabase(user.id, initialMessage);
      } catch (error) {
        toast({
          title: "Error clearing messages",
          description: "Your messages couldn't be cleared from the cloud.",
          variant: "destructive"
        });
      }
    }
  };

  // Mark a message as read
  const markMessageAsRead = async (messageId: number) => {
    if (!user || !isSupabaseConfigured()) return;

    try {
      await markMessageAsReadInSupabase(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return {
    messages,
    setMessages,
    clearMessages,
    addMessage,
    markMessageAsRead
  };
}
