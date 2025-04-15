
// Type definitions for Vitest
import { Mock as VitestMock, vi } from 'vitest';

declare global {
  type Mock<T extends any[] = any[], R = any> = VitestMock<T, R>;
  const vi: typeof import('vitest')['vi'];
}
