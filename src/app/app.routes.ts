import {Routes} from '@angular/router';
import {Shell} from './core/layout/shell/shell';
import {CarDetail} from './features/cars/car-detail/car-detail';
import {Login} from './features/auth/login/login';
import {authGuard} from './features/auth/auth.guard';
import {Dashboard} from './features/dashboard/dashboard';
import {Profile} from './features/profile/profile';

export const routes: Routes = [
  {path: 'login', component: Login},

  {
    path: '',
    canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: Dashboard},
      {path: 'profile', component: Profile},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'cars/:id', component: CarDetail, data: {title: 'Szczegóły samochodu'},}
    ]
  }
];
