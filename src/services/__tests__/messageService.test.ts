
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
    }))
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
      (supabase.from().select().eq().order as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      const result = await fetchMessagesFromSupabase(userId);
      expect(result).toHaveLength(2);
      expect(supabase.from).toHaveBeenCalledWith('messages');
    });

    it('handles empty response', async () => {
      const mockSupabaseResponse = { data: [], error: null };
      (supabase.from().select().eq().order as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      const result = await fetchMessagesFromSupabase(userId);
      expect(result).toBeNull();
    });

    it('throws error on Supabase error', async () => {
      const mockSupabaseResponse = { data: null, error: new Error('Database error') };
      (supabase.from().select().eq().order as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      await expect(fetchMessagesFromSupabase(userId)).rejects.toThrow('Database error');
    });
  });

  describe('saveWelcomeMessageToSupabase', () => {
    it('saves welcome message successfully', async () => {
      const mockSupabaseResponse = { error: null };
      (supabase.from().insert as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      await expect(saveWelcomeMessageToSupabase(userId, mockMessage))
        .resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith('messages');
    });

    it('throws error on Supabase error', async () => {
      const mockSupabaseResponse = { error: new Error('Insert failed') };
      (supabase.from().insert as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      await expect(saveWelcomeMessageToSupabase(userId, mockMessage))
        .rejects.toThrow('Insert failed');
    });
  });

  describe('saveMessageToSupabase', () => {
    it('saves message successfully', async () => {
      const mockSupabaseResponse = { error: null };
      (supabase.from().insert as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      await expect(saveMessageToSupabase(userId, { 
        text: 'Test',
        sender: 'user',
        read: true
      })).resolves.not.toThrow();
    });
  });

  describe('clearMessagesFromSupabase', () => {
    it('clears messages successfully', async () => {
      const mockSupabaseResponse = { error: null };
      (supabase.from().delete().eq as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      await expect(clearMessagesFromSupabase(userId)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith('messages');
    });
  });

  describe('markMessageAsReadInSupabase', () => {
    it('marks message as read successfully', async () => {
      const mockSupabaseResponse = { error: null };
      (supabase.from().update().eq as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      await expect(markMessageAsReadInSupabase(1)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith('messages');
    });
  });
});
