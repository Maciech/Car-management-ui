import { Routes } from '@angular/router';
import {Shell} from './core/layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then(m => m.Dashboard),
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile')
            .then(m => m.Profile),
        data: {
          title: 'Profile',
        }
      }
    ]
  }
];
