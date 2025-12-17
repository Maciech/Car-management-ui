import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Layout} from '../layout';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private layout = inject(Layout);

  expanded = this.layout.sidebarExpanded;

  navItems: NavItem[] = [
    { icon: '🏠', label: 'Dashboard', route: '/' },
    { icon: '👤', label: 'Profil', route: '/profile' },
    { icon: '⚙️', label: 'Ustawienia', route: '/settings' }
  ];

  toggle() {
    this.layout.toggleSidebar();
  }

}
