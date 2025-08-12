// src/app/core/theme.service.ts
import { Injectable } from '@angular/core';

export type Theme = 'white' | 'high-contrast-dark' | 'eink' | 'eink-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private current: Theme;

  constructor() {
    const saved = (localStorage.getItem(this.storageKey) as Theme) || null;
    const prefersDark =
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

    // default to E-Ink? keep your current logic; I’ll default to light
    this.current = saved ?? (prefersDark ? 'high-contrast-dark' : 'white');
    this.applyTheme(this.current);
  }

  getTheme(): Theme { return this.current; }
  isDark(): boolean { return this.current === 'high-contrast-dark'; }
  setTheme(theme: Theme): void {
    this.current = theme;
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }
  toggle(): void {
    this.setTheme(this.isDark() ? 'white' : 'high-contrast-dark');
  }

  private applyTheme(theme: Theme): void {
  const classes = ['theme-white','theme-high-contrast-dark','theme-eink','theme-eink-dark'];
  document.documentElement.classList.remove(...classes);
  document.body.classList.remove(...classes);

  const cls =
    theme === 'white' ? 'theme-white' :
    theme === 'eink'  ? 'theme-eink'  :
    theme === 'eink-dark' ? 'theme-eink-dark' :
    'theme-high-contrast-dark';

  document.documentElement.classList.add(cls);
  document.body.classList.add(cls);

  document.documentElement.style.colorScheme =
    (theme === 'high-contrast-dark' || theme === 'eink-dark') ? 'dark' : 'light';
}
}
