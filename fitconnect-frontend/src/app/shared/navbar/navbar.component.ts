import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="logo">
        <span class="mark">FC</span>
        <span>FitConnect <b>AI</b></span>
      </a>

      <div class="links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Accueil</a>
        <a routerLink="/coaches" routerLinkActive="active">Coachs</a>
        <a routerLink="/nutritionnistes" routerLinkActive="active">Nutritionnistes</a>
        <a routerLink="/boutique" routerLinkActive="active">Boutique</a>

        @if (auth.isAuthenticated()) {
          <a routerLink="/espace" routerLinkActive="active">Mon espace</a>
          @if (auth.hasRole('CLIENT')) {
            <a routerLink="/suivi" routerLinkActive="active">Mon suivi</a>
          }
          @if (auth.hasRole('ADMIN')) {
            <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          }
        }
      </div>

      <div class="right">
        @if (auth.isAuthenticated()) {
          <div class="dropdown">
            <button class="menu-trigger" type="button">
              Menu
              @if (cart.totalItems() > 0) {
                <span class="cart-badge">{{ cart.totalItems() }}</span>
              }
            </button>
            <div class="menu-panel">
              <a routerLink="/ai/chat">Assistant IA</a>
              <a routerLink="/reservations">Réservations</a>
              <a routerLink="/commandes">Commandes</a>
              <a routerLink="/panier">Panier @if (cart.totalItems() > 0) { <b>{{ cart.totalItems() }}</b> }</a>
              <a routerLink="/notifications">Alertes</a>
            </div>
          </div>

          <a routerLink="/profil" class="user-chip">{{ auth.currentUser()?.firstName }}</a>
          <button class="btn btn-outline" (click)="auth.logout()">Déconnexion</button>
        } @else {
          <a routerLink="/auth/login" class="btn btn-outline">Connexion</a>
          <a routerLink="/auth/register" class="btn btn-primary">Inscription</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 clamp(16px, 4vw, 56px);
      min-height: 82px;
      background: #171719;
      border-bottom: 3px solid var(--primary);
      box-shadow: 0 10px 34px rgba(0,0,0,0.18);
      position: sticky;
      top: 0;
      z-index: 100;
      flex-wrap: wrap;
      gap: 12px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 19px;
      font-weight: 900;
      color: #fff;
      text-transform: uppercase;
    }
    .logo b { color: var(--primary); }
    .mark {
      width: 46px;
      height: 46px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: #fff;
      background: var(--primary);
      box-shadow: inset 0 -6px 0 rgba(0,0,0,.14);
    }
    .links {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      align-self: stretch;
      align-items: stretch;
    }
    .links a {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 800;
      color: #fff;
      padding: 0 14px;
      border-bottom: 3px solid transparent;
      text-transform: uppercase;
      letter-spacing: .4px;
    }
    .links a.active,
    .links a:hover {
      color: #fff;
      background: var(--primary);
      border-color: #fff;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .dropdown { position: relative; }
    .menu-trigger {
      position: relative;
      border: 1px solid rgba(255,255,255,.36);
      background: transparent;
      color: #fff;
      border-radius: 8px;
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
    }
    .menu-panel {
      position: absolute;
      right: 0;
      top: calc(100% + 10px);
      min-width: 220px;
      background: #fff;
      color: #171719;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 18px 36px rgba(0,0,0,.18);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-6px);
      transition: .18s;
      z-index: 200;
    }
    .dropdown:hover .menu-panel,
    .dropdown:focus-within .menu-panel {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .menu-panel a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .menu-panel a:hover { background: #f4f4f4; color: var(--primary); }
    .menu-panel b {
      background: var(--primary);
      color: #fff;
      border-radius: 20px;
      padding: 1px 8px;
      font-size: 11px;
    }
    .cart-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--primary);
      color: #fff;
      font-size: 11px;
      border-radius: 50%;
      padding: 1px 6px;
    }
    .user-chip {
      font-size: 14px;
      font-weight: 700;
      background: #fff;
      color: #171719;
      padding: 8px 12px;
      border-radius: 8px;
    }
    .btn-outline {
      border-color: rgba(255,255,255,.48);
      color: #fff;
    }
    @media (max-width: 1050px) {
      .navbar { padding-block: 12px; }
      .links {
        order: 3;
        width: 100%;
        align-self: auto;
      }
      .links a { padding: 10px 12px; }
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, public cart: CartService) {}
}
