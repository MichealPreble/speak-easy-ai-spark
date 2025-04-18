
import { 
  fetchMessagesFromSupabase,
  saveWelcomeMessageToSupabase,
  saveMessageToSupabase,
  clearMessagesFromSupabase,
  markMessageAsReadInSupabase
} from '../messageService';
import { supabase } from '@/lib/supabase';
import { mockMessage, mockMessages } from './testUtils';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis()
    })),
    isSupabaseConfigured: jest.fn().mockReturnValue(true)
  }
}));

describe('messageService', () => {
  const userId = 'test-user-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMessagesFromSupabase', () => {
    it('fetches messages successfully', async () => {
      const mockSupabaseResponse = { data: mockMessages, error: null };
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue(mockSupabaseResponse);
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder
      });
      
      const result = await fetchMessagesFromSupabase(userId);
      
      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
      expect(mockOrder).toHaveBeenCalledWith('timestamp', { ascending: true });
      expect(result).toHaveLength(2);
    });

    it('handles empty response', async () => {
      const mockSupabaseResponse = { data: [], error: null };
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue(mockSupabaseResponse)
      });

      const result = await fetchMessagesFromSupabase(userId);
      expect(result).toBeNull();
    });

    it('throws error on Supabase error', async () => {
      const mockSupabaseResponse = { data: null, error: new Error('Database error') };
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue(mockSupabaseResponse)
      });

      await expect(fetchMessagesFromSupabase(userId)).rejects.toThrow('Database error');
    });
  });

  describe('saveWelcomeMessageToSupabase', () => {
    it('saves welcome message successfully', async () => {
      const mockSupabaseResponse = { error: null };
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockSupabaseResponse)
      });

      await expect(saveWelcomeMessageToSupabase(userId, mockMessage))
        .resolves.not.toThrow();
        
      expect(supabase.from).toHaveBeenCalledWith('messages');
    });

    it('throws error on Supabase error', async () => {
      const mockSupabaseResponse = { error: new Error('Insert failed') };
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockSupabaseResponse)
      });

      await expect(saveWelcomeMessageToSupabase(userId, mockMessage))
        .rejects.toThrow('Insert failed');
    });
  });

  describe('saveMessageToSupabase', () => {
    it('saves message successfully', async () => {
      const mockSupabaseResponse = { error: null };
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockSupabaseResponse)
      });

      await expect(saveMessageToSupabase(userId, { 
        text: 'Test',
        sender: 'user',
        read: true
      })).resolves.not.toThrow();
      
      expect(supabase.from).toHaveBeenCalledWith('messages');
    });
  });

  describe('clearMessagesFromSupabase', () => {
    it('clears messages successfully', async () => {
      const mockSupabaseResponse = { error: null };
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue(mockSupabaseResponse);
      
      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq
      });

      await expect(clearMessagesFromSupabase(userId)).resolves.not.toThrow();
      
      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
    });
  });

  describe('markMessageAsReadInSupabase', () => {
    it('marks message as read successfully', async () => {
      const mockSupabaseResponse = { error: null };
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue(mockSupabaseResponse);
      
      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq
      });

      await expect(markMessageAsReadInSupabase(1)).resolves.not.toThrow();
      
      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(mockUpdate).toHaveBeenCalledWith({ read: true });
      expect(mockEq).toHaveBeenCalledWith('id', 1);
    });
  });
});
