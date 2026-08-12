# FitConnect AI — Backend (Spring Boot)

Backend REST pour la plateforme **FitConnect AI** : gestion des coachs, nutritionnistes,
réservations, marketplace, suivi sportif, avis, notifications et fonctionnalités IA (via **Groq**).

## Stack

- Spring Boot 3.3 / Java 17
- Spring Security + JWT (jjwt 0.12)
- Spring Data JPA + MySQL
- WebClient (pour l'appel à l'API Groq)
- Lombok, Bean Validation
- Swagger / OpenAPI

## Démarrage

1. Créer une base MySQL (ou laisser `createDatabaseIfNotExist=true` la créer automatiquement).
2. Configurer `src/main/resources/application.properties` :
   - `spring.datasource.username` / `spring.datasource.password`
   - `jwt.secret` (déjà généré, à changer en production)
   - `groq.api.key` — **à définir via la variable d'environnement `GROQ_API_KEY`**
     (ou directement dans le fichier, pour le dev local uniquement).
3. Lancer :
   ```bash
   export GROQ_API_KEY=ta_cle_groq
   mvn spring-boot:run
   ```
4. Swagger disponible sur : `http://localhost:8080/swagger-ui.html`

## Clé API Groq

Le modèle utilisé par défaut est `llama-3.3-70b-versatile` (`groq.api.model`).
Tu peux le changer selon les modèles disponibles sur https://console.groq.com/docs/models.

## Architecture des packages

```
com.fitconnect.backend
 ├─ entity        → Entités JPA (User, Coach, Nutritionist, Booking, Product, Order, ...)
 ├─ repository     → Interfaces Spring Data JPA
 ├─ security       → JWT (JwtUtil, JwtAuthFilter, UserDetailsServiceImpl)
 ├─ config         → SecurityConfig (CORS, routes publiques/privées, rôles)
 ├─ dto            → Objets de requête/réponse (auth, booking, product, order, tracking, review, ai)
 ├─ service        → Logique métier
 ├─ controller     → Endpoints REST
 └─ exception      → Gestion centralisée des erreurs (GlobalExceptionHandler)
```

## Rôles & sécurité

Rôles : `ADMIN`, `CLIENT`, `COACH`, `NUTRITIONNISTE`.
Le token JWT est renvoyé lors du login/register et doit être transmis dans le header :
```
Authorization: Bearer <token>
```

Routes publiques (sans authentification) : `/api/auth/**`, `/api/public/**`.
Routes réservées : `/api/admin/**` (ADMIN), `/api/coach/**` (COACH/ADMIN), `/api/nutritionniste/**` (NUTRITIONNISTE/ADMIN).
Le reste nécessite un token valide.

## Principaux endpoints

| Domaine | Endpoint | Description |
|---|---|---|
| Auth | `POST /api/auth/register` | Inscription (crée aussi le profil Coach/Nutritionniste si le rôle correspond) |
| Auth | `POST /api/auth/login` | Connexion, retourne un JWT |
| Coachs | `GET /api/public/coaches` | Liste des coachs |
| Coachs | `POST /api/coach/{id}/disponibilites` | Ajouter un créneau |
| Nutritionnistes | `GET /api/public/nutritionnistes` | Liste des nutritionnistes |
| Réservations | `POST /api/bookings` | Réserver une séance/consultation |
| Réservations | `GET /api/bookings/me` | Mes réservations |
| Marketplace | `GET /api/public/products` | Liste/recherche de produits |
| Marketplace | `POST /api/admin/products` | Créer un produit (admin) |
| Commandes | `POST /api/orders` | Passer commande (gère le stock automatiquement) |
| Suivi | `POST /api/tracking` | Ajouter une mesure (poids, taille → IMC calculé auto) |
| Avis | `POST /api/reviews` | Noter un coach/nutritionniste/produit |
| Notifications | `GET /api/notifications/me` | Mes notifications |
| Messagerie | `POST /api/messages` | Envoyer un message (patient ↔ nutritionniste) |
| Dashboard | `GET /api/admin/dashboard/stats` | Statistiques globales (admin) |
| **IA (Groq)** | `POST /api/ai/programme-sportif` | Génère un programme d'entraînement personnalisé |
| **IA (Groq)** | `POST /api/ai/plan-alimentaire` | Génère un plan alimentaire personnalisé |
| **IA (Groq)** | `POST /api/ai/chat` | Chatbot assistant virtuel |
| **IA (Groq)** | `POST /api/ai/analyse-progression` | Analyse les données de suivi et donne des conseils |

## Ce qui est déjà implémenté

- Authentification JWT complète avec création automatique du profil métier selon le rôle
- CRUD Coach / Nutritionniste + disponibilités
- Réservations avec notifications automatiques
- Marketplace (catégories, produits, promotions, gestion du stock)
- Commandes avec calcul du total et des promotions
- Suivi sportif avec calcul automatique de l'IMC
- Avis avec recalcul automatique de la note moyenne
- Notifications et messagerie interne
- Dashboard admin (statistiques)
- Intégration Groq pour : génération de programme sportif, plan alimentaire, chatbot, analyse de progression

## À compléter selon tes besoins

- Endpoints de recommandation intelligente (coach/produit selon profil) — squelette prêt dans `GroqAiService`, à enrichir
- Upload d'images (produits, photos de profil) — à ajouter avec `MultipartFile` + stockage local ou cloud
- Tests unitaires/intégration
- Pagination sur les listes (produits, commandes, etc.)
