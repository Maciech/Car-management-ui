import {Routes} from '@angular/router';
import {Shell} from './core/layout/shell/shell';
import {CarDetail} from './features/cars/car-detail/car-detail';
import {CarsList} from './features/cars/cars-list/cars-list';
import {Login} from './features/auth/login/login';
import {authGuard} from './features/auth/auth.guard';
import {Dashboard} from './features/dashboard/dashboard';
import {Profile} from './features/profile/profile';
import {RegisterComponent} from './features/auth/register/register.component/register.component';
import {InvitePage} from './features/invite/invite-page';
import {Marketplace} from './features/marketplace/marketplace';

export const routes: Routes = [
  // ── Public routes (no auth required) ──────────────────────────────────────
  {path: '', component: Marketplace, pathMatch: 'full'},
  {path: 'login',    component: Login},
  {path: 'register', component: RegisterComponent},
  {path: 'invite',   component: InvitePage},

  // ── Authenticated shell ────────────────────────────────────────────────────
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {path: 'dashboard',  component: Dashboard},
      {path: 'profile',    component: Profile},
      {path: 'cars',       component: CarsList},
      {path: 'cars/:id',   component: CarDetail, data: {title: 'Szczegóły samochodu'}},
    ]
  }
];
