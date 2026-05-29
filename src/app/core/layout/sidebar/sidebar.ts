import {Component, inject, signal} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Layout} from '../layout';
import {CarSearchModal} from '../../../features/cars/car-search-modal/car-search-modal';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CarSearchModal],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private layout = inject(Layout);

  expanded = this.layout.sidebarExpanded;
  showSearch = signal(false);

  navItems: NavItem[] = [
    {icon: '🏠', label: 'Dashboard', route: '/dashboard'},
    {icon: '🚗', label: 'Samochody', route: '/cars'},
    {icon: '👤', label: 'Profil', route: '/profile'},
  ];

  toggle() {
    this.layout.toggleSidebar();
  }

  openSearch() {
    this.showSearch.set(true);
  }

  closeSearch() {
    this.showSearch.set(false);
  }
}
