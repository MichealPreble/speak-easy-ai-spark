
import { vi } from 'vitest';
import { detectHesitations, analyzeSpokenCadence, analyzeSpeechClarity } from "@/utils/speech";

// Mock the speech analysis utilities
vi.mock('@/utils/speech', () => ({
  detectHesitations: vi.fn(),
  analyzeSpokenCadence: vi.fn(),
  analyzeSpeechClarity: vi.fn(),
}));

// Helper function to reset mocks with default values
export function resetMocksWithDefaults() {
  vi.clearAllMocks();
  
  // Set up default mock implementations
  (detectHesitations as Mock).mockReturnValue({ count: 0 });
  (analyzeSpokenCadence as Mock).mockReturnValue(8);
  (analyzeSpeechClarity as Mock).mockReturnValue({
    score: 7,
    rating: 'good',
    suggestions: []
  });
}
