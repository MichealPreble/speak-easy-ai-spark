import { Message } from "@/types/chat";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

// Fetch messages from Supabase
export async function fetchMessagesFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  // Ensure proper type conversion
  return data?.map((message: any) => ({
    id: Number(message.id),
    text: String(message.text || ''),
    sender: String(message.sender || 'bot'),
    timestamp: new Date(message.timestamp || Date.now()),
    isVoiceMessage: Boolean(message.isVoiceMessage),
    isFeedback: Boolean(message.isFeedback),
    read: Boolean(message.read)
  })) || [];
}

// Save a message to Supabase
export async function saveMessageToSupabase(userId: string, message: Omit<Message, 'id' | 'timestamp'>) {
  const { error } = await supabase
    .from('messages')
    .insert({
      user_id: userId,
      text: message.text,
      sender: message.sender,
      isVoiceMessage: message.isVoiceMessage || false,
      isFeedback: message.isFeedback || false,
      read: message.read || false,
    });

  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

// Save the initial welcome message to Supabase
export async function saveWelcomeMessageToSupabase(userId: string, message: Message) {
  const { error } = await supabase
    .from('messages')
    .insert({
      id: message.id,
      user_id: userId,
      text: message.text,
      sender: message.sender,
      timestamp: message.timestamp.toISOString(),
      read: true,
    });

  if (error) {
    console.error('Error saving welcome message:', error);
    throw error;
  }
}

// Clear all messages from Supabase for a specific user
export async function clearMessagesFromSupabase(userId: string) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing messages:', error);
    throw error;
  }
}

// Mark a message as read in Supabase
export async function markMessageAsReadInSupabase(messageId: number) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);

  if (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}

// Create a subscription to messages table changes
export function subscribeToMessages(userId: string, callback: () => void): RealtimeChannel {
  return supabase
    .channel('messages_channel')
    .on(
      'postgres_changes',
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
