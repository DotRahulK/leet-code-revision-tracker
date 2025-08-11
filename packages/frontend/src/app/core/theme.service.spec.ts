import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('defaults to dark when OS prefers dark', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const service = new ThemeService();
    expect(service.isDark()).toBe(true);
    vi.unstubAllGlobals();
  });

  it('toggles theme and persists', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const service = new ThemeService();
    expect(service.getTheme()).toBe('white');
    service.toggle();
    expect(service.getTheme()).toBe('high-contrast-dark');
    expect(localStorage.getItem('theme')).toBe('high-contrast-dark');
    const second = new ThemeService();
    expect(second.isDark()).toBe(true);
    vi.unstubAllGlobals();
  });
});
