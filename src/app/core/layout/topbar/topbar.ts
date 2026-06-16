import {Component, HostListener, inject, signal} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';
import {AuthService} from '../../../features/auth/auth-service';
import {ThemeService} from '../../theme/theme.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private router = inject(Router);
  private auth   = inject(AuthService);
  protected theme = inject(ThemeService);

  title    = signal('');
  menuOpen = signal(false);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const active = this.getDeepestRoute(this.router.routerState.snapshot.root);
        this.title.set(active.data['title'] ?? '');
        this.menuOpen.set(false);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.profile-area')) {
      this.menuOpen.set(false);
    }
  }

  get userInitials(): string {
    const token = localStorage.getItem('token');
    if (!token) return '?';
    try {
      const p = JSON.parse(atob(token.split('.')[1]));
      return (p.sub as string)?.[0]?.toUpperCase() ?? '?';
    } catch { return '?'; }
  }

  get userEmail(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      return JSON.parse(atob(token.split('.')[1])).sub as string;
    } catch { return ''; }
  }

  toggleMenu() { this.menuOpen.update(v => !v); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private getDeepestRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
