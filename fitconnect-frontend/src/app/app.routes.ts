import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },

  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: 'coaches',
    loadComponent: () => import('./features/coaches/coach-list/coach-list.component').then(m => m.CoachListComponent)
  },
  {
    path: 'coaches/:id',
    loadComponent: () => import('./features/coaches/coach-detail/coach-detail.component').then(m => m.CoachDetailComponent)
  },

  {
    path: 'nutritionnistes',
    loadComponent: () => import('./features/nutritionists/nutritionist-list/nutritionist-list.component').then(m => m.NutritionistListComponent)
  },
  {
    path: 'nutritionnistes/:id',
    loadComponent: () => import('./features/nutritionists/nutritionist-detail/nutritionist-detail.component').then(m => m.NutritionistDetailComponent)
  },

  {
    path: 'reservations',
    canActivate: [authGuard],
    loadComponent: () => import('./features/booking/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
  },

  {
    path: 'boutique',
    loadComponent: () => import('./features/marketplace/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'boutique/:id',
    loadComponent: () => import('./features/marketplace/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'panier',
    loadComponent: () => import('./features/marketplace/cart/cart.component').then(m => m.CartComponent)
  },

  {
    path: 'commandes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders/my-orders/my-orders.component').then(m => m.MyOrdersComponent)
  },

  {
    path: 'suivi',
    canActivate: [authGuard, roleGuard(['CLIENT'])],
    loadComponent: () => import('./features/tracking/tracking.component').then(m => m.TrackingComponent)
  },

  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
  },

  {
    path: 'ai/chat',
    loadComponent: () => import('./features/ai/chat/chat.component').then(m => m.ChatComponent)
  },
  {
    path: 'ai/programme-sportif',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ai/training-program/training-program.component').then(m => m.TrainingProgramComponent)
  },
  {
    path: 'ai/plan-alimentaire',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ai/nutrition-plan/nutrition-plan.component').then(m => m.NutritionPlanComponent)
  },

  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'espace',
    canActivate: [authGuard],
    loadComponent: () => import('./features/role-space/role-space.component').then(m => m.RoleSpaceComponent)
  },
  {
    path: 'creneaux',
    canActivate: [authGuard, roleGuard(['COACH', 'NUTRITIONNISTE'])],
    loadComponent: () => import('./features/availability/availability-manager.component').then(m => m.AvailabilityManagerComponent)
  },

  {
    path: 'profil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },

  { path: '**', redirectTo: '' }
];
