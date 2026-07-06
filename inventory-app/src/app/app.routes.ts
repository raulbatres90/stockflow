import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'productos',
    loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'alertas',
    loadComponent: () => import('./features/alerts/alerts.component').then(m => m.AlertsComponent)
  },
  {
    path: 'movimientos',
    loadComponent: () => import('./features/movements/movement-form.component').then(m => m.MovementFormComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
