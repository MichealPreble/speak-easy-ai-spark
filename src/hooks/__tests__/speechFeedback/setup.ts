
import { vi } from 'vitest';
import * as speechUtils from "@/utils/speech";

// Mock the speech utility functions
vi.mock("@/utils/speech", () => ({
  detectHesitations: vi.fn(),
  analyzeSpokenCadence: vi.fn(),
  analyzeSpeechClarity: vi.fn()
}));

// Reset mocks with default implementations
export function resetMocksWithDefaults() {
  // Mock implementations for speech utility functions
  (speechUtils.detectHesitations as any).mockReturnValue({ count: 0, percentage: 0, patterns: [] });
  (speechUtils.analyzeSpokenCadence as any).mockReturnValue(7);
  (speechUtils.analyzeSpeechClarity as any).mockReturnValue({
    score: 0,
    rating: 'fair',
    suggestions: []
  });
}
