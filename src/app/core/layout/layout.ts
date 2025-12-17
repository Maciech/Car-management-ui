import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Layout {

  sidebarExpanded = signal(false);

  toggleSidebar() {
    this.sidebarExpanded.update(v => !v);
  }
}
