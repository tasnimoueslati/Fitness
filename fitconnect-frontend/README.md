# FitConnect AI — Frontend (Angular 18, standalone)

Frontend Angular pour la plateforme FitConnect AI, connecté au backend Spring Boot.

## Stack

- Angular 18 (composants **standalone**, signals, `@if`/`@for` control flow)
- Routing avec **lazy loading** par fonctionnalité
- Reactive Forms
- Intercepteurs HTTP (JWT + gestion des erreurs 401)
- Guards (auth + rôles)

## Démarrage

```bash
npm install
npm start
```

L'app tourne par défaut sur `http://localhost:4200` et appelle le backend sur
`http://localhost:8080/api` (voir `src/environments/environment.ts`).

⚠️ Pense à activer CORS côté Spring Boot pour `http://localhost:4200`
(déjà fait dans `app.cors.allowed-origins` du backend fourni).

## Structure

```
src/app/
 ├─ core/
 │   ├─ models/        → Interfaces TypeScript (miroir des DTO backend)
 │   ├─ services/       → Appels HTTP (Auth, Coach, Nutritionist, Booking, Product,
 │   │                     Cart, Order, Tracking, Review, Notification, Ai, Dashboard)
 │   ├─ interceptors/   → jwt.interceptor (ajoute le token), error.interceptor (401 → logout)
 │   └─ guards/         → authGuard, roleGuard(['ADMIN', ...])
 ├─ shared/
 │   └─ navbar/         → Barre de navigation réactive (signals)
 ├─ features/
 │   ├─ auth/           → login, register
 │   ├─ coaches/        → liste + détail avec réservation de créneau
 │   ├─ nutritionists/  → liste + détail avec réservation de créneau
 │   ├─ booking/        → mes réservations
 │   ├─ marketplace/    → boutique, détail produit + avis, panier
 │   ├─ orders/         → mes commandes
 │   ├─ tracking/        → suivi sportif (poids, IMC auto, mensurations)
 │   ├─ notifications/  → notifications utilisateur
 │   ├─ ai/             → chat assistant, programme sportif IA, plan alimentaire IA
 │   ├─ dashboard/      → statistiques admin
 │   └─ profile/        → profil utilisateur
 ├─ app.routes.ts       → toutes les routes (lazy loaded)
 ├─ app.config.ts       → providers (HttpClient + interceptors, Router)
 └─ app.component.ts    → shell (navbar + router-outlet)
```

## Authentification

- Le token JWT est stocké dans le `localStorage` (`fitconnect_token` / `fitconnect_user`).
- `AuthService` expose un signal `currentUser` et des helpers `isAuthenticated()`,
  `hasRole(...roles)`.
- Le `jwtInterceptor` ajoute automatiquement le header `Authorization: Bearer <token>`
  à chaque requête (sauf `/auth/**`).
- Le `errorInterceptor` déconnecte l'utilisateur et redirige vers `/auth/login`
  en cas de réponse `401`.

## Panier

Le panier (`CartService`) est géré côté client avec les **signals** Angular et
persisté dans le `localStorage`, indépendamment de la connexion — un visiteur
peut ajouter des produits avant de se connecter, la commande n'est envoyée au
backend qu'au moment du paiement (`/panier` → "Passer la commande").

## Ce qui est déjà implémenté

- Authentification complète (inscription avec choix du rôle, connexion, déconnexion)
- Consultation des coachs/nutritionnistes + réservation d'un créneau disponible
- Mes réservations (annulation)
- Boutique avec recherche, filtre par catégorie, promotions, panier, commande
- Mes commandes (historique + statut)
- Suivi sportif avec calcul auto de l'IMC (affiché depuis le backend)
- Avis clients sur les produits
- Notifications utilisateur
- Assistant IA (chat), génération de programme sportif et de plan alimentaire (via Groq côté backend)
- Dashboard admin (statistiques globales)
- Profil utilisateur éditable

## À compléter selon tes besoins

- Espace dédié Coach / Nutritionniste (gestion des disponibilités, vue patients/clients,
  création de plans alimentaires) — les services backend existent déjà (`CoachService`,
  `NutritionistService`), il reste à créer les vues dédiées à ces rôles
- Messagerie interne (le service backend `MessageController` existe déjà, l'UI reste à faire)
- Upload d'image (photo de profil, image produit)
- Pagination sur les listes
- Tests unitaires (Jasmine/Karma déjà configurés par défaut avec Angular CLI)
