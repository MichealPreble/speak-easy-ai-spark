
import { loadMessagesFromLocalStorage, saveMessagesToLocalStorage } from '../localStorageService';
import { mockMessage, mockMessages } from './testUtils';

describe('localStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadMessagesFromLocalStorage', () => {
    it('returns default welcome message when localStorage is empty', () => {
      const messages = loadMessagesFromLocalStorage();
      expect(messages).toHaveLength(1);
      expect(messages[0].sender).toBe('bot');
      expect(messages[0].text).toContain('Welcome to SpeakEasyAI');
    });

    it('loads messages from localStorage correctly', () => {
      localStorage.setItem('chatMessages', JSON.stringify(mockMessages));
      const messages = loadMessagesFromLocalStorage();
      expect(messages).toHaveLength(2);
      expect(messages[0].text).toBe(mockMessages[0].text);
      expect(messages[1].sender).toBe(mockMessages[1].sender);
    });

    it('handles invalid JSON in localStorage', () => {
      localStorage.setItem('chatMessages', 'invalid-json');
      const messages = loadMessagesFromLocalStorage();
      expect(messages).toHaveLength(1); // Should return default welcome message
      expect(messages[0].sender).toBe('bot');
    });
  });

  describe('saveMessagesToLocalStorage', () => {
    it('saves messages to localStorage correctly', () => {
      saveMessagesToLocalStorage(mockMessages);
      const stored = localStorage.getItem('chatMessages');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].text).toBe(mockMessages[0].text);
    });

    it('overwrites existing messages', () => {
      saveMessagesToLocalStorage([mockMessage]);
      saveMessagesToLocalStorage(mockMessages);
      const stored = localStorage.getItem('chatMessages');
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(2);
    });
  });
});
