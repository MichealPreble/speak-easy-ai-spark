
// Type definitions for Vitest
import { Mock as VitestMock } from 'vitest';

declare global {
  type Mock<T extends any[] = any[], R = any> = VitestMock<T, R>;
}
