import { Routes } from '@angular/router';
import {
  AuthGuardService as AuthGuard
} from '../services/auth-guard.service';

export const CommonLayout_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('../../orders/orders.module').then((m) => m.OrdersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () =>
      import('../../products/products.module').then((m) => m.ProductsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../../profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard]
  }
];
