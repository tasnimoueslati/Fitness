import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { CoachService } from '../../core/services/coach.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { NutritionistService } from '../../core/services/nutritionist.service';
import { OrderService } from '../../core/services/order.service';
import { Role } from '../../core/models/user.model';
import { Booking } from '../../core/models/booking.model';
import { Coach, Nutritionist } from '../../core/models/coach.model';

type Tile = { label: string; value: string; tone: string };
type Shortcut = { title: string; text: string; link: string; tag: string };
type Task = { title: string; meta: string; status: string };
type ModuleItem = { title: string; text: string; link?: string; badge: string };

@Component({
  selector: 'app-role-space',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="workspace">
      <section class="workspace-hero">
        <div>
          <p class="kicker">{{ roleLabel }}</p>
          <h1>Bonjour {{ auth.currentUser()?.firstName || 'sportif' }}</h1>
          <p>{{ intro }}</p>
        </div>
        <div class="hero-card">
          <span>Session active</span>
          <strong>{{ auth.currentUser()?.role || 'CLIENT' }}</strong>
          <small>{{ auth.currentUser()?.email }}</small>
        </div>
      </section>

      @if (statsError) {
        <p class="alert">{{ statsError }}</p>
      }

      <section class="tiles">
        @for (tile of tiles; track tile.label) {
          <div class="tile" [class]="tile.tone">
            <span>{{ tile.label }}</span>
            <strong>{{ statsLoading ? '...' : tile.value }}</strong>
          </div>
        }
      </section>

      <section class="layout">
        <div class="main-column">
          <section class="panel">
            <div class="panel-head">
              <p class="kicker">Actions principales</p>
              <h2>{{ actionTitle }}</h2>
            </div>
            <div class="shortcut-grid">
              @for (shortcut of shortcuts; track shortcut.title) {
                <a [routerLink]="shortcut.link" class="shortcut">
                  <span>{{ shortcut.tag }}</span>
                  <h3>{{ shortcut.title }}</h3>
                  <p>{{ shortcut.text }}</p>
                </a>
              }
            </div>
          </section>

          <section class="panel">
            <div class="panel-head">
              <p class="kicker">Modules métier</p>
              <h2>{{ moduleTitle }}</h2>
            </div>
            <div class="module-list">
              @for (module of modules; track module.title) {
                <div class="module-row">
                  <div>
                    <span>{{ module.badge }}</span>
                    <h3>{{ module.title }}</h3>
                    <p>{{ module.text }}</p>
                  </div>
                  @if (module.link) {
                    <a [routerLink]="module.link" class="mini-btn">Ouvrir</a>
                  } @else {
                    <button class="mini-btn muted" type="button">À connecter</button>
                  }
                </div>
              }
            </div>
          </section>
        </div>

        <aside class="side-column">
          <section class="panel compact">
            <p class="kicker">Aujourd'hui</p>
            <h2>Priorités</h2>
            <div class="task-list">
              @for (task of tasks; track task.title) {
                <div class="task">
                  <div>
                    <strong>{{ task.title }}</strong>
                    <span>{{ task.meta }}</span>
                  </div>
                  <b>{{ task.status }}</b>
                </div>
              }
            </div>
          </section>

          <section class="panel compact">
            @switch (currentRole) {
              @case ('ADMIN') {
                <p class="kicker">Admin</p>
                <h2>Contrôle rapide</h2>
                <label>Recherche utilisateur</label>
                <input [(ngModel)]="adminSearch" placeholder="Nom, email ou rôle">
                <label>Action</label>
                <select [(ngModel)]="adminAction">
                  <option>Vérifier un compte</option>
                  <option>Contrôler une commande</option>
                  <option>Analyser le stock</option>
                  <option>Préparer une promotion</option>
                </select>
                <a routerLink="/admin/dashboard" class="btn btn-primary full">Ouvrir le dashboard</a>
              }
              @case ('COACH') {
                <p class="kicker">Coach</p>
                <h2>Créneaux</h2>
                <p class="side-copy">La gestion des disponibilités se fait dans une page dédiée reliée au backend.</p>
                <a routerLink="/creneaux" class="btn btn-primary full">Gérer mes créneaux</a>
                <a routerLink="/profil" class="btn btn-outline full">Mettre à jour mon profil</a>
              }
              @case ('NUTRITIONNISTE') {
                <p class="kicker">Nutrition</p>
                <h2>Créneaux et plans</h2>
                <p class="side-copy">Gérez vos disponibilités, puis générez les plans depuis l'assistant IA.</p>
                <a routerLink="/creneaux" class="btn btn-primary full">Gérer mes créneaux</a>
                <a routerLink="/ai/plan-alimentaire" class="btn btn-outline full">Générer un plan</a>
              }
              @default {
                <p class="kicker">Client</p>
                <h2>Objectif personnel</h2>
                <label>Objectif</label>
                <select [(ngModel)]="clientGoal">
                  <option>Remise en forme</option>
                  <option>Perte de poids</option>
                  <option>Prise de masse</option>
                  <option>Endurance</option>
                </select>
                <label>Disponibilité</label>
                <input [(ngModel)]="clientAvailability" placeholder="Soir, weekend...">
                <a routerLink="/ai/programme-sportif" class="btn btn-primary full">Créer mon programme</a>
              }
            }
          </section>
        </aside>
      </section>
    </main>
  `,
  styles: [`
    .workspace { padding: 28px clamp(16px, 5vw, 70px) 64px; }
    .workspace-hero {
      min-height: 280px;
      border-radius: 8px;
      padding: 38px;
      color: #fff;
      background:
        linear-gradient(100deg, rgba(17,17,19,.96), rgba(17,17,19,.72)),
        url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1500&q=80') center/cover;
      display: grid;
      grid-template-columns: 1fr 280px;
      align-items: end;
      gap: 28px;
      border-bottom: 5px solid var(--primary);
    }
    .kicker { color: var(--primary); text-transform: uppercase; letter-spacing: 3px; font-size: 12px; font-weight: 900; margin: 0 0 10px; }
    h1 { font-size: clamp(36px, 6vw, 68px); line-height: .95; margin: 0 0 14px; text-transform: uppercase; }
    h2 { margin: 0; font-size: 26px; }
    h3 { margin: 0; }
    .workspace-hero p:last-child { max-width: 760px; color: #e2e2e2; font-size: 18px; line-height: 1.55; margin: 0; }
    .hero-card { background: rgba(255,255,255,.95); color: #151515; border-radius: 8px; padding: 20px; }
    .hero-card span { color: var(--primary); font-size: 12px; font-weight: 900; text-transform: uppercase; }
    .hero-card strong { display: block; font-size: 32px; margin: 8px 0; }
    .hero-card small { color: #606060; overflow-wrap: anywhere; }
    .alert { margin: 18px 0 0; padding: 12px 14px; border-radius: 8px; background: #fff8e1; color: #8a5a00; }
    .tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 20px 0; }
    .tile {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      border-left: 5px solid var(--primary);
      box-shadow: 0 10px 28px rgba(0,0,0,.06);
    }
    .tile span { color: #777; font-weight: 700; font-size: 12px; text-transform: uppercase; }
    .tile strong { display: block; margin-top: 12px; font-size: 30px; }
    .tile.dark { background: #1c1c1e; color: #fff; }
    .tile.green { border-left-color: #2e7d32; }
    .tile.gold { border-left-color: #f9a825; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 18px; align-items: start; }
    .main-column, .side-column { display: grid; gap: 18px; }
    .panel { background: #fff; border-radius: 8px; padding: 22px; box-shadow: 0 10px 28px rgba(0,0,0,.06); }
    .panel-head { display: flex; justify-content: space-between; gap: 20px; align-items: end; margin-bottom: 18px; }
    .shortcut-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .shortcut {
      min-height: 180px;
      border: 1px solid #ececec;
      border-radius: 8px;
      padding: 18px;
      transition: .2s;
      background: #fafafa;
    }
    .shortcut:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 14px 26px rgba(0,0,0,.08); }
    .shortcut span, .module-row span { color: var(--primary); font-size: 11px; font-weight: 900; text-transform: uppercase; }
    .shortcut h3 { margin: 24px 0 10px; font-size: 20px; }
    .shortcut p, .module-row p, .side-copy { color: #626262; line-height: 1.55; margin: 0; }
    .module-list { display: grid; gap: 12px; }
    .module-row {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: center;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 16px;
    }
    .module-row h3 { margin: 5px 0 6px; font-size: 18px; }
    .mini-btn {
      border: 0;
      border-radius: 8px;
      background: #171719;
      color: #fff;
      padding: 10px 14px;
      font-weight: 800;
      white-space: nowrap;
    }
    .mini-btn.muted { background: #efefef; color: #777; }
    .compact h2 { margin-bottom: 16px; }
    .task-list { display: grid; gap: 10px; }
    .task {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    .task strong { display: block; font-size: 14px; }
    .task span { display: block; color: #777; font-size: 12px; margin-top: 4px; }
    .task b { color: var(--primary); font-size: 12px; text-transform: uppercase; white-space: nowrap; }
    .full { width: 100%; text-align: center; margin-top: 10px; }
    @media (max-width: 1100px) {
      .workspace-hero, .layout { grid-template-columns: 1fr; }
      .tiles, .shortcut-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .workspace-hero { padding: 26px; }
      .tiles, .shortcut-grid { grid-template-columns: 1fr; }
      .panel-head, .module-row { display: block; }
      .mini-btn { display: inline-block; margin-top: 12px; }
    }
  `]
})
export class RoleSpaceComponent implements OnInit {
  statsLoading = true;
  statsError = '';
  private dynamicTiles: Tile[] | null = null;
  private currentBookings: Booking[] = [];
  adminSearch = '';
  adminAction = 'Vérifier un compte';
  clientGoal = 'Remise en forme';
  clientAvailability = '';

  constructor(
    public auth: AuthService,
    private bookingService: BookingService,
    private coachService: CoachService,
    private dashboardService: DashboardService,
    private nutritionistService: NutritionistService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadRoleData();
  }

  get currentRole(): Role {
    return this.auth.userRole() || 'CLIENT';
  }

  get roleLabel(): string {
    if (this.currentRole === 'COACH') return 'Espace coach sportif';
    if (this.currentRole === 'NUTRITIONNISTE') return 'Espace nutritionniste';
    if (this.currentRole === 'ADMIN') return 'Espace administrateur';
    return 'Espace client';
  }

  get intro(): string {
    if (this.currentRole === 'COACH') return 'Gérez votre profil, vos disponibilités, vos réservations, vos clients et les programmes sportifs.';
    if (this.currentRole === 'NUTRITIONNISTE') return 'Pilotez les consultations, les patients, les plans alimentaires, la messagerie et les recommandations marketplace.';
    if (this.currentRole === 'ADMIN') return 'Administrez les utilisateurs, les produits, les commandes, les réservations, les statistiques et les alertes.';
    return 'Réservez vos séances, suivez votre progression, consultez vos plans IA, vos commandes et vos recommandations.';
  }

  get actionTitle(): string {
    if (this.currentRole === 'ADMIN') return 'Pilotage de la plateforme';
    if (this.currentRole === 'COACH') return 'Gestion coach';
    if (this.currentRole === 'NUTRITIONNISTE') return 'Gestion nutrition';
    return 'Parcours adhérent';
  }

  get moduleTitle(): string {
    if (this.currentRole === 'ADMIN') return 'Administration complète';
    if (this.currentRole === 'COACH') return 'Coaching et suivi sportif';
    if (this.currentRole === 'NUTRITIONNISTE') return 'Consultation et plans alimentaires';
    return 'Sport, nutrition et shopping';
  }

  get tiles(): Tile[] {
    return this.dynamicTiles || this.defaultTiles();
  }

  get shortcuts(): Shortcut[] {
    if (this.currentRole === 'ADMIN') {
      return [
        { tag: 'Stats', title: 'Dashboard global', text: 'Suivre utilisateurs, coachs, commandes, chiffre d’affaires et réservations du jour.', link: '/admin/dashboard' },
        { tag: 'Catalogue', title: 'Produits et stock', text: 'Contrôler les produits, catégories, promotions et ruptures de stock.', link: '/boutique' },
        { tag: 'Flux', title: 'Commandes', text: 'Consulter les commandes, statuts, livraisons et historique client.', link: '/commandes' }
      ];
    }
    if (this.currentRole === 'COACH') {
      return [
        { tag: 'Agenda', title: 'Mes réservations', text: 'Voir les demandes, séances confirmées, annulations et historique.', link: '/reservations' },
        { tag: 'Créneaux', title: 'Disponibilités', text: 'Ajouter, modifier ou supprimer les créneaux visibles par les clients.', link: '/creneaux' },
        { tag: 'IA', title: 'Programme sportif', text: 'Créer un programme adapté à l’âge, au niveau et à l’objectif du client.', link: '/ai/programme-sportif' }
      ];
    }
    if (this.currentRole === 'NUTRITIONNISTE') {
      return [
        { tag: 'Agenda', title: 'Consultations', text: 'Gérer les demandes de rendez-vous, reports, annulations et historique.', link: '/reservations' },
        { tag: 'Créneaux', title: 'Disponibilités', text: 'Gérer les créneaux de consultation visibles par les clients.', link: '/creneaux' },
        { tag: 'IA', title: 'Plan alimentaire', text: 'Générer un plan selon calories, objectif, allergies et préférences.', link: '/ai/plan-alimentaire' }
      ];
    }
    return [
      { tag: 'Réserver', title: 'Coach sportif', text: 'Trouver un coach par spécialité, disponibilité, tarif et avis.', link: '/coaches' },
      { tag: 'Nutrition', title: 'Nutritionniste', text: 'Réserver une consultation et obtenir un suivi alimentaire personnalisé.', link: '/nutritionnistes' },
      { tag: 'Progression', title: 'Mon suivi', text: 'Saisir poids, taille, IMC, mensurations, objectifs et performances.', link: '/suivi' }
    ];
  }

  get modules(): ModuleItem[] {
    if (this.currentRole === 'ADMIN') {
      return [
        { badge: 'Utilisateurs', title: 'Gestion des rôles', text: 'Administrateur, client, coach et nutritionniste avec contrôle des accès.', link: '/admin/dashboard' },
        { badge: 'Marketplace', title: 'Produits, catégories et promotions', text: 'Ajout, modification, suppression logique, stock et promotions.', link: '/boutique' },
        { badge: 'Réservations', title: 'Supervision des rendez-vous', text: 'Vue globale des séances, consultations, annulations et planning.', link: '/reservations' },
        { badge: 'Notifications', title: 'Alertes système', text: 'Commandes, rappels, promotions, messages et alertes de stock.', link: '/notifications' }
      ];
    }
    if (this.currentRole === 'COACH') {
      return [
        { badge: 'Disponibilités', title: 'Créneaux coach', text: 'Ajouter, modifier ou bloquer les jours et heures disponibles.', link: '/creneaux' },
        { badge: 'Clients', title: 'Liste des clients suivis', text: 'Consulter les dossiers, notes, objectifs et évolution sportive.' },
        { badge: 'Programmes', title: 'Programmes personnalisés', text: 'Créer des entraînements par niveau, objectif et historique.', link: '/ai/programme-sportif' },
        { badge: 'Historique', title: 'Séances passées', text: 'Retrouver les séances réalisées, avis et commentaires client.', link: '/reservations' }
      ];
    }
    if (this.currentRole === 'NUTRITIONNISTE') {
      return [
        { badge: 'Disponibilités', title: 'Créneaux nutrition', text: 'Ajouter, modifier ou supprimer les créneaux de consultation.', link: '/creneaux' },
        { badge: 'Patients', title: 'Dossiers nutrition', text: 'Voir objectifs, poids, IMC, allergies, préférences et notes de consultation.' },
        { badge: 'Plans', title: 'Plans alimentaires', text: 'Définir repas, quantités, calories et macronutriments.', link: '/ai/plan-alimentaire' },
        { badge: 'Marketplace', title: 'Recommandation produit', text: 'Associer compléments et accessoires au profil du patient.', link: '/boutique' }
      ];
    }
    return [
      { badge: 'Réservations', title: 'Mes rendez-vous', text: 'Consulter, modifier ou annuler les séances coach et consultations.', link: '/reservations' },
      { badge: 'Suivi', title: 'Progression physique', text: 'Poids, taille, IMC, mensurations, objectifs et historique.', link: '/suivi' },
      { badge: 'IA', title: 'Programme et nutrition', text: 'Générer entraînement et plan alimentaire personnalisés.', link: '/ai/chat' },
      { badge: 'Boutique', title: 'Commandes et recommandations', text: 'Acheter les produits recommandés et suivre les commandes.', link: '/boutique' }
    ];
  }

  get tasks(): Task[] {
    const pending = this.currentBookings.filter((b) => b.statut === 'EN_ATTENTE').length;
    const confirmed = this.currentBookings.filter((b) => b.statut === 'CONFIRMEE').length;

    if (this.currentRole === 'ADMIN') {
      return [
        { title: 'Contrôler les stocks faibles', meta: 'Marketplace', status: 'urgent' },
        { title: 'Vérifier les commandes', meta: 'Livraison et paiement', status: 'à faire' },
        { title: 'Analyser les réservations', meta: 'Planning global', status: 'suivi' }
      ];
    }
    if (this.currentRole === 'COACH') {
      return [
        { title: 'Valider les demandes', meta: `${pending} réservation(s) en attente`, status: 'à faire' },
        { title: 'Préparer les séances', meta: `${confirmed} séance(s) confirmée(s)`, status: 'suivi' },
        { title: 'Gérer mes créneaux', meta: 'Disponibilités publiques', status: 'agenda' }
      ];
    }
    if (this.currentRole === 'NUTRITIONNISTE') {
      return [
        { title: 'Valider les consultations', meta: `${pending} demande(s) en attente`, status: 'à faire' },
        { title: 'Préparer les plans', meta: `${confirmed} consultation(s) confirmée(s)`, status: 'IA' },
        { title: 'Recommander des produits', meta: 'Compléments adaptés', status: 'store' }
      ];
    }
    return [
      { title: 'Réserver une séance', meta: `${confirmed} rendez-vous confirmé(s)`, status: 'à faire' },
      { title: 'Mettre à jour le suivi', meta: 'Poids et objectif', status: 'suivi' },
      { title: 'Voir recommandations', meta: 'IA et boutique', status: 'store' }
    ];
  }

  private loadRoleData(): void {
    this.statsLoading = true;
    this.statsError = '';

    if (this.currentRole === 'ADMIN') {
      this.dashboardService.getStats().pipe(catchError(() => of(null))).subscribe((stats) => {
        if (!stats) this.statsError = 'Impossible de charger les statistiques admin depuis le backend.';
        this.dynamicTiles = [
          { label: 'Utilisateurs', value: String(stats?.['nombreUtilisateurs'] ?? 0), tone: 'dark' },
          { label: 'Commandes', value: String(stats?.['nombreCommandes'] ?? 0), tone: '' },
          { label: 'Chiffre d’affaires', value: `${stats?.['chiffreAffaires'] ?? 0} TND`, tone: 'green' },
          { label: 'Réservations du jour', value: String(stats?.['reservationsDuJour'] ?? 0), tone: 'gold' }
        ];
        this.statsLoading = false;
      });
      return;
    }

    if (this.currentRole === 'COACH') {
      this.coachService.getMyProfile().pipe(catchError(() => of(null))).subscribe((coach) => {
        if (!coach) {
          this.statsError = 'Aucun profil coach trouvé pour cet utilisateur.';
          this.dynamicTiles = this.defaultTiles();
          this.statsLoading = false;
          return;
        }
        this.loadProfessionalStats(coach, 'COACH');
      });
      return;
    }

    if (this.currentRole === 'NUTRITIONNISTE') {
      this.nutritionistService.getMyProfile().pipe(catchError(() => of(null))).subscribe((nutritionist) => {
        if (!nutritionist) {
          this.statsError = 'Aucun profil nutritionniste trouvé pour cet utilisateur.';
          this.dynamicTiles = this.defaultTiles();
          this.statsLoading = false;
          return;
        }
        this.loadProfessionalStats(nutritionist, 'NUTRITIONNISTE');
      });
      return;
    }

    forkJoin({
      bookings: this.bookingService.myBookings().pipe(catchError(() => of([] as Booking[]))),
      orders: this.orderService.myOrders().pipe(catchError(() => of([])))
    }).subscribe(({ bookings, orders }) => {
      this.currentBookings = bookings;
      this.dynamicTiles = [
        { label: 'Réservations', value: String(bookings.length), tone: 'dark' },
        { label: 'Confirmées', value: String(bookings.filter((b) => b.statut === 'CONFIRMEE').length), tone: '' },
        { label: 'Commandes', value: String(orders.length), tone: 'green' },
        { label: 'Plan IA', value: 'Actif', tone: 'gold' }
      ];
      this.statsLoading = false;
    });
  }

  private loadProfessionalStats(profile: Coach | Nutritionist, role: 'COACH' | 'NUTRITIONNISTE'): void {
    const bookings$ = role === 'COACH'
      ? this.bookingService.coachBookings(profile.id)
      : this.bookingService.nutritionistBookings(profile.id);
    const slots$ = role === 'COACH'
      ? this.coachService.getAvailability(profile.id)
      : this.nutritionistService.getAvailability(profile.id);

    forkJoin({
      bookings: bookings$.pipe(catchError(() => of([] as Booking[]))),
      slots: slots$.pipe(catchError(() => of([])))
    }).subscribe(({ bookings, slots }) => {
      this.currentBookings = bookings;
      const clients = new Set(bookings.map((b) => b.client?.id).filter(Boolean)).size;
      const pending = bookings.filter((b) => b.statut === 'EN_ATTENTE').length;
      const done = bookings.filter((b) => b.statut === 'TERMINEE').length;

      this.dynamicTiles = role === 'COACH'
        ? [
            { label: 'Séances à traiter', value: String(pending), tone: 'dark' },
            { label: 'Clients suivis', value: String(clients), tone: '' },
            { label: 'Créneaux disponibles', value: String(slots.length), tone: 'green' },
            { label: 'Avis moyen', value: String(profile.noteMoyenne || 0), tone: 'gold' }
          ]
        : [
            { label: 'Consultations à traiter', value: String(pending), tone: 'dark' },
            { label: 'Patients actifs', value: String(clients), tone: '' },
            { label: 'Créneaux disponibles', value: String(slots.length), tone: 'green' },
            { label: 'Consultations terminées', value: String(done), tone: 'gold' }
          ];
      this.statsLoading = false;
    });
  }

  private defaultTiles(): Tile[] {
    if (this.currentRole === 'COACH') {
      return [
        { label: 'Séances à traiter', value: '0', tone: 'dark' },
        { label: 'Clients suivis', value: '0', tone: '' },
        { label: 'Créneaux disponibles', value: '0', tone: 'green' },
        { label: 'Avis moyen', value: '0', tone: 'gold' }
      ];
    }
    if (this.currentRole === 'NUTRITIONNISTE') {
      return [
        { label: 'Consultations à traiter', value: '0', tone: 'dark' },
        { label: 'Patients actifs', value: '0', tone: '' },
        { label: 'Créneaux disponibles', value: '0', tone: 'green' },
        { label: 'Consultations terminées', value: '0', tone: 'gold' }
      ];
    }
    if (this.currentRole === 'ADMIN') {
      return [
        { label: 'Utilisateurs', value: '0', tone: 'dark' },
        { label: 'Commandes', value: '0', tone: '' },
        { label: 'Chiffre d’affaires', value: '0 TND', tone: 'green' },
        { label: 'Réservations du jour', value: '0', tone: 'gold' }
      ];
    }
    return [
      { label: 'Réservations', value: '0', tone: 'dark' },
      { label: 'Confirmées', value: '0', tone: '' },
      { label: 'Commandes', value: '0', tone: 'green' },
      { label: 'Plan IA', value: 'Actif', tone: 'gold' }
    ];
  }
}
