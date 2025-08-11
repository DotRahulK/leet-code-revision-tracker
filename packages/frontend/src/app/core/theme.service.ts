import { Injectable } from '@angular/core';

type Theme = 'white' | 'high-contrast-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private current: Theme;

  constructor() {
    const saved = (localStorage.getItem(this.storageKey) as Theme) || null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.current = saved ?? (prefersDark ? 'high-contrast-dark' : 'white');
    this.applyTheme(this.current);
  }

  getTheme(): Theme {
    return this.current;
  }

  setTheme(theme: Theme): void {
    this.current = theme;
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  toggle(): void {
    this.setTheme(this.isDark() ? 'white' : 'high-contrast-dark');
  }

  isDark(): boolean {
    return this.current === 'high-contrast-dark';
  }

  private applyTheme(theme: Theme): void {
    const body = document.body.classList;
    body.remove('theme-white', 'theme-high-contrast-dark');
    body.add(theme === 'white' ? 'theme-white' : 'theme-high-contrast-dark');
  }
}
