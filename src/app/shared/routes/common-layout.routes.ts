import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('../../orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('../../products/products.module').then((m) => m.ProductsModule),
  },

];
