import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-shade"></div>
      <div class="hero-inner">
        <div class="hero-spacer"></div>
        <div class="hero-content">
          <p class="kicker">Plateforme intelligente de salle de sport</p>
          <h1><span>FitConnect</span> AI</h1>
          <p class="lead">
            Réservations, coaching, nutrition, suivi de progression et marketplace sportive
            dans une seule expérience premium.
          </p>
          <div class="actions">
            <a routerLink="/auth/register" class="btn btn-primary">Commencer</a>
            <a routerLink="/boutique" class="btn btn-light">Explorer la boutique</a>
          </div>
        </div>
        <div class="hero-panel">
          <span class="panel-label">Objectif du jour</span>
          <strong>Programme IA + séance coach</strong>
          <div class="metric-row">
            <span>Calories</span>
            <b>2 250</b>
          </div>
          <div class="metric-row">
            <span>Progression</span>
            <b>78%</b>
          </div>
        </div>
      </div>
    </section>

    <section class="section dark-band">
      <div class="section-head">
        <p class="kicker">Espaces dédiés</p>
        <h2>Chaque rôle a son tableau de bord</h2>
      </div>
      <div class="role-grid">
        @for (role of roles; track role.title) {
          <a [routerLink]="role.link" class="role-card">
            <span>{{ role.tag }}</span>
            <h3>{{ role.title }}</h3>
            <p>{{ role.text }}</p>
          </a>
        }
      </div>
    </section>

    <section class="section shop-preview">
      <div>
        <p class="kicker">Marketplace sportive</p>
        <h2>Une boutique qui ressemble à un vrai site e-commerce</h2>
        <p>
          Filtres, promotions, stock, notes, panier et recommandations IA pour relier les achats
          aux objectifs sportifs et nutritionnels.
        </p>
        <a routerLink="/boutique" class="btn btn-primary">Voir les produits</a>
      </div>
      <div class="product-strip">
        @for (product of products; track product.name) {
          <div class="mini-product">
            <img [src]="product.image" [alt]="product.name">
            <span>{{ product.badge }}</span>
            <strong>{{ product.name }}</strong>
            <b>{{ product.price }}</b>
          </div>
        }
      </div>
    </section>

    <section class="footer-like">
      <div>
        <h3>FitConnect AI</h3>
        <p>Coaching, nutrition, IA et commerce sportif connectés.</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>contact&#64;fitconnect.ai</p>
        <p>+216 55 000 000</p>
      </div>
      <div>
        <h4>Services</h4>
        <a routerLink="/coaches">Coachs</a>
        <a routerLink="/nutritionnistes">Nutritionnistes</a>
        <a routerLink="/ai/chat">Assistant IA Groq</a>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: min(720px, calc(100vh - 82px));
      position: relative;
      display: flex;
      align-items: center;
      padding: clamp(42px, 6vw, 76px) clamp(20px, 6vw, 86px);
      color: #fff;
      background:
        linear-gradient(90deg, rgba(13,13,15,0.92) 0%, rgba(13,13,15,0.72) 44%, rgba(13,13,15,0.42) 100%),
        url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=80') center/cover;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(120deg, rgba(255,70,18,0.16) 1px, transparent 1px),
        linear-gradient(30deg, rgba(255,255,255,0.07) 1px, transparent 1px);
      background-size: 90px 90px;
      opacity: .45;
    }
    .hero-inner {
      position: relative;
      z-index: 1;
      width: min(1180px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(280px, .86fr) minmax(420px, .74fr);
      gap: clamp(28px, 5vw, 70px);
      align-items: center;
    }
    .hero-spacer { min-height: 360px; }
    .hero-content, .hero-panel { position: relative; z-index: 1; min-width: 0; }
    .hero-content {
      justify-self: end;
      max-width: 560px;
      padding-top: 8px;
    }
    .kicker {
      margin: 0 0 14px;
      color: var(--primary);
      font-weight: 800;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-size: 12px;
    }
    h1 {
      margin: 0;
      font-size: clamp(54px, 7.2vw, 98px);
      line-height: .88;
      text-transform: uppercase;
      font-weight: 900;
      max-width: 10ch;
      overflow-wrap: normal;
    }
    h1 span { display: block; }
    h1 span { color: var(--primary); }
    .lead {
      max-width: 520px;
      color: #e8e8e8;
      font-size: clamp(18px, 1.55vw, 24px);
      line-height: 1.55;
      margin: 22px 0 30px;
    }
    .actions { display: flex; flex-wrap: wrap; gap: 14px; }
    .btn-light { background: #fff; color: #141414; }
    .hero-panel {
      grid-column: 2;
      width: min(340px, 100%);
      justify-self: end;
      background: rgba(18,18,20,.82);
      border: 1px solid rgba(255,255,255,.13);
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 22px 60px rgba(0,0,0,.35);
    }
    .panel-label { color: #aaa; font-size: 12px; text-transform: uppercase; font-weight: 800; }
    .hero-panel strong { display: block; margin: 8px 0 18px; font-size: 22px; }
    .metric-row { display: flex; justify-content: space-between; padding: 13px 0; border-top: 1px solid rgba(255,255,255,.12); }
    .section { padding: 64px clamp(20px, 7vw, 110px); }
    .dark-band { background: #1a1a1c; color: #fff; }
    .section-head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 26px; }
    h2 { margin: 0; font-size: clamp(28px, 4vw, 48px); line-height: 1.05; }
    .role-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .role-card {
      min-height: 210px;
      padding: 22px;
      border-radius: 8px;
      background: #242426;
      border-bottom: 4px solid var(--primary);
      transition: .2s;
    }
    .role-card:hover { transform: translateY(-5px); background: #2b2b2e; }
    .role-card span { color: var(--primary); font-weight: 900; font-size: 12px; }
    .role-card h3 { margin: 26px 0 10px; font-size: 22px; }
    .role-card p { color: #c9c9c9; line-height: 1.55; margin: 0; }
    .shop-preview {
      display: grid;
      grid-template-columns: .9fr 1.1fr;
      gap: 34px;
      align-items: center;
      background: #f6f6f4;
    }
    .shop-preview p { color: #555; line-height: 1.7; max-width: 560px; }
    .product-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .mini-product {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 12px 28px rgba(0,0,0,.08);
      display: grid;
      gap: 8px;
      padding-bottom: 14px;
    }
    .mini-product img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; }
    .mini-product span, .mini-product strong, .mini-product b { margin: 0 14px; }
    .mini-product span { color: var(--primary); font-size: 12px; font-weight: 800; }
    .mini-product b { color: #111; }
    .footer-like {
      background: #171719;
      color: #fff;
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: 28px;
      padding: 46px clamp(20px, 7vw, 110px);
      border-top: 4px solid var(--primary);
    }
    .footer-like p, .footer-like a { color: #b9b9b9; display: block; margin: 8px 0; }
    @media (max-width: 980px) {
      .shop-preview, .footer-like { grid-template-columns: 1fr; }
      .hero { min-height: auto; }
      .hero-inner { grid-template-columns: 1fr; }
      .hero-spacer { display: none; }
      .hero-content { justify-self: start; max-width: 680px; }
      .role-grid, .product-strip { grid-template-columns: repeat(2, 1fr); }
      .hero-panel { grid-column: auto; justify-self: start; }
    }
    @media (max-width: 620px) {
      .hero { padding: 38px 18px; }
      h1 { font-size: clamp(46px, 18vw, 70px); }
      .actions .btn { width: 100%; text-align: center; }
      .role-grid, .product-strip { grid-template-columns: 1fr; }
      .section-head { display: block; }
    }
  `]
})
export class HomeComponent {
  roles = [
    { tag: 'CLIENT', title: 'Espace adhérent', text: 'Réservations, suivi physique, commandes, recommandations IA et historique complet.', link: '/espace' },
    { tag: 'COACH', title: 'Espace coach', text: 'Disponibilités, séances, programmes sportifs, clients suivis et notes de progression.', link: '/espace' },
    { tag: 'NUTRITION', title: 'Espace nutritionniste', text: 'Patients, plans alimentaires, consultations, recommandations produit et assistance IA.', link: '/espace' },
    { tag: 'ADMIN', title: 'Espace admin', text: 'Utilisateurs, stock, commandes, chiffre d’affaires, réservations et pilotage global.', link: '/admin/dashboard' }
  ];

  products = [
    {
      name: 'Whey Performance',
      badge: 'Nutrition',
      price: '89 TND',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Gants Training',
      badge: 'Accessoire',
      price: '42 TND',
      image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Tenue Pro Fit',
      badge: 'Vêtement',
      price: '119 TND',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'
    }
  ];
}
