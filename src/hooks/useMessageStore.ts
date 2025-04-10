
import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useMessageStore() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      // Fall back to localStorage if no user is authenticated
      if (!user) {
        const saved = localStorage.getItem('chatMessages');
        return saved
          ? JSON.parse(saved, (key, value) =>
              key === 'timestamp' ? new Date(value) : value
            )
          : [
              {
                id: 1,
                text: "Welcome to SpeakEasyAI! I'm your public speaking assistant, ready to help you become a more confident and effective speaker.\n\nI can help you:\n- Structure your speeches\n- Integrate personal stories\n- Improve your delivery\n- Practice with voice recognition and get detailed feedback\n- Build confidence techniques\n\nTry the voice button to record a practice segment and receive analysis on your pace, filler words, and delivery. How would you like to enhance your speaking skills today?",
                sender: "bot",
                timestamp: new Date(),
                read: true
              },
            ];
      }
      return [];
    } catch (error) {
      console.error("Error loading chat messages:", error);
      return [
        {
          id: 1,
          text: "Welcome to SpeakEasyAI! I'm your public speaking assistant. How can I help you improve your speaking skills today?",
          sender: "bot",
          timestamp: new Date(),
          read: true
        },
      ];
    }
  });

  // Fetch messages from Supabase when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: true });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Transform Supabase data format to match our Message type
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
            isVoiceMessage: msg.is_voice_message,
            isFeedback: msg.is_feedback,
            read: msg.read
          }));
          setMessages(formattedMessages);
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
          await supabase.from('messages').insert({
            user_id: user.id,
            text: welcomeMessage.text,
            sender: welcomeMessage.sender,
            timestamp: welcomeMessage.timestamp,
            read: welcomeMessage.read
          });
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

    // Set up real-time subscription
    const subscription = supabase
      .channel('messages_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages', 
          filter: `user_id=eq.${user.id}` 
        }, 
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, toast]);

  // Save to localStorage if no user is authenticated
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat messages:", error);
      }
    }
  }, [messages, user]);

  // Add a message to Supabase or localStorage
  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now(),
      timestamp: new Date(),
    };

    // Add to state immediately for UI responsiveness
    setMessages(prev => [...prev, newMessage]);

    // If authenticated, save to Supabase
    if (user) {
      try {
        await supabase.from('messages').insert({
          user_id: user.id,
          text: message.text,
          sender: message.sender,
          is_voice_message: message.isVoiceMessage || false,
          is_feedback: message.isFeedback || false,
          read: message.read || false,
        });
      } catch (error) {
        console.error("Error saving message to Supabase:", error);
        toast({
          title: "Error saving message",
          description: "Your message couldn't be saved to the cloud.",
          variant: "destructive"
        });
      }
    }
  };

  // Clear messages from Supabase or localStorage
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

    // If authenticated, clear from Supabase and add initial message
    if (user) {
      try {
        // Delete all existing messages
        await supabase
          .from('messages')
          .delete()
          .eq('user_id', user.id);
        
        // Add welcome message
        await supabase.from('messages').insert({
          user_id: user.id,
          text: initialMessage.text,
          sender: initialMessage.sender,
          timestamp: initialMessage.timestamp,
          read: initialMessage.read
        });
      } catch (error) {
        console.error("Error clearing messages in Supabase:", error);
        toast({
          title: "Error clearing messages",
          description: "Your messages couldn't be cleared from the cloud.",
          variant: "destructive"
        });
      }
    }
  };

  // Mark a message as read in Supabase
  const markMessageAsRead = async (messageId: number) => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
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
