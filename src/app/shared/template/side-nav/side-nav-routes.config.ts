import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'dashboard',
    submenu: [],
  },
  {
    path: '/orders',
    title: 'Orders',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'profile',
    submenu: [],
  },
  {
    path: '/products',
    title: 'Products',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'mobile',
    submenu: [],
  },
];
