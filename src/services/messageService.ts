
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

// Fetch messages from Supabase
export async function fetchMessagesFromSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Transform Supabase data format to match our Message type
      return data.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        isVoiceMessage: msg.is_voice_message,
        isFeedback: msg.is_feedback,
        read: msg.read
      }));
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

// Save welcome message to Supabase
export async function saveWelcomeMessageToSupabase(userId: string, welcomeMessage: Message) {
  try {
    await supabase.from('messages').insert({
      user_id: userId,
      text: welcomeMessage.text,
      sender: welcomeMessage.sender,
      timestamp: welcomeMessage.timestamp,
      read: welcomeMessage.read
    });
  } catch (error) {
    console.error("Error saving welcome message:", error);
    throw error;
  }
}

// Save message to Supabase
export async function saveMessageToSupabase(userId: string, message: Omit<Message, 'id' | 'timestamp'>) {
  try {
    await supabase.from('messages').insert({
      user_id: userId,
      text: message.text,
      sender: message.sender,
      is_voice_message: message.isVoiceMessage || false,
      is_feedback: message.isFeedback || false,
      read: message.read || false,
    });
  } catch (error) {
    console.error("Error saving message to Supabase:", error);
    throw error;
  }
}

// Clear messages from Supabase
export async function clearMessagesFromSupabase(userId: string) {
  try {
    await supabase
      .from('messages')
      .delete()
      .eq('user_id', userId);
  } catch (error) {
    console.error("Error clearing messages in Supabase:", error);
    throw error;
  }
}

// Mark message as read in Supabase
export async function markMessageAsReadInSupabase(messageId: number) {
  try {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
}

// Create Supabase real-time subscription
export function subscribeToMessages(userId: string, callback: () => void) {
  return supabase
    .channel('messages_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'messages', 
        filter: `user_id=eq.${userId}` 
      }, 
      () => {
        callback();
      }
    )
    .subscribe();
}
