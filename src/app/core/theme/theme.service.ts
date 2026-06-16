import {Injectable, signal} from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({providedIn: 'root'})
export class ThemeService {
  private readonly KEY = 'app-theme';

  theme = signal<Theme>(this.load());

  constructor() {
    this.apply(this.theme());
  }

  toggle() {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.apply(next);
    localStorage.setItem(this.KEY, next);
  }

  isDark() { return this.theme() === 'dark'; }

  private load(): Theme {
    return (localStorage.getItem(this.KEY) as Theme | null) ?? 'light';
  }

  private apply(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
