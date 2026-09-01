# TaskFlow — Frontend (React)

Application web de gestion de projets, tâches et tags. Interface React consommant l'API REST [TaskFlow API](../backend/README.md) (Node.js/Express/MongoDB).

---

## Sommaire

- [Architecture générale](#architecture-générale)
- [Choix techniques](#choix-techniques)
- [Authentification](#authentification)
- [Routes](#routes)
- [Gestion de l'état](#gestion-de-létat)
- [Appels API](#appels-api)
- [Variables d'environnement](#variables-denvironnement)
- [Installation et lancement](#installation-et-lancement)
- [Tests](#tests)
- [Build de production](#build-de-production)

---

## Architecture générale

```
src/
├── main.jsx                # Point d'entrée, montage de <App /> dans le DOM
├── App.jsx                 # Déclaration du routeur et des routes de l'application
├── PrivateRoute.jsx         # Garde de route : redirige vers /login si non authentifié
├── context/
│   ├── authContextValue.js  # createContext() seul (exigé par le lint Fast Refresh)
│   ├── AuthContext.jsx      # Composant AuthProvider (état d'authentification, token)
│   └── useAuth.js           # Hook useAuth()
├── services/
│   └── api.js                # Instance Axios centralisée + intercepteurs
├── components/               # Composants réutilisables (Header, Footer, cartes Project/Task/Tag, profil)
├── pages/                    # Une page par route (Home, Login, Register, listes et formulaires CRUD)
└── __tests__/                 # Tests unitaires et d'intégration (Vitest + Testing Library)
```

Le projet suit une séparation classique **pages / composants / services** :

- **`pages/`** : un composant par route, orchestre l'appel API et l'affichage (ex. `CreateTask.jsx`, `EditProject.jsx`).
- **`components/`** : éléments d'UI réutilisables entre plusieurs pages (ex. `Header`, `Footer`, `Task`, `Project`, `Tag`).
- **`services/api.js`** : point unique de communication avec le backend.
- **`context/`** : état global partagé (authentification).

## Choix techniques

| Besoin               | Choix                                       | Raison                                                                                                            |
| -------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Bundler / dev server | **Vite**                                    | Démarrage et rechargement (HMR) très rapides par rapport à Create React App                                       |
| UI                   | **React 19**                                | Version courante, hooks, composants fonctionnels                                                                  |
| Routage              | **react-router-dom v7**                     | Standard pour le routage côté client en SPA, gestion des routes protégées                                         |
| Appels HTTP          | **axios**                                   | Intercepteurs simples pour injecter le token JWT et gérer les erreurs 401 globalement                             |
| Tests                | **Vitest + @testing-library/react + jsdom** | Intégré nativement à Vite (même config/transform que l'app), API compatible Jest                                  |
| État global          | **Context API (React)**                     | Un seul état global nécessaire (le token d'authentification) : pas besoin d'une librairie externe (Redux/Zustand) |

## Authentification

L'authentification repose sur un **token JWT** délivré par l'API backend au login.

- `context/AuthContext.jsx` expose un `AuthProvider` et un hook `useAuth()`. Le token est initialisé depuis `localStorage` au chargement de l'app, et toute mise à jour (`setToken`) est répercutée dans `localStorage`.
- `PrivateRoute.jsx` protège les routes qui nécessitent d'être connecté : si aucun token n'est présent dans `localStorage`, l'utilisateur est redirigé vers `/login` (via `<Navigate>`).
- `services/api.js` ajoute automatiquement le header `Authorization: Bearer <token>` à chaque requête sortante (intercepteur de requête), et supprime le token du `localStorage` si l'API répond `401 Unauthorized` (intercepteur de réponse), forçant une déconnexion silencieuse.
- Le `Header` adapte les liens affichés (Connexion/Déconnexion, Accueil, Inscription) selon la présence du token.

## Routes

Toutes les routes sont déclarées dans `App.jsx` avec `react-router-dom`.

| Route              | Page          | Accès  |
| ------------------ | ------------- | ------ |
| `/`                | Home          | Public |
| `/login`           | Login         | Public |
| `/register`        | Register      | Public |
| `/projects`        | Projects      | Privé  |
| `/createProject`   | CreateProject | Privé  |
| `/editProject/:id` | EditProject   | Privé  |
| `/tasks`           | Tasks         | Privé  |
| `/createTask`      | CreateTask    | Privé  |
| `/editTask/:id`    | EditTask      | Privé  |
| `/tags`            | Tags          | Privé  |
| `/createTag`       | CreateTag     | Privé  |
| `/editTag/:id`     | EditTag       | Privé  |
| `/editUser/:id`    | EditUser      | Privé  |

Les routes "Privé" sont enveloppées dans `<PrivateRoute>`, qui bloque l'accès sans token valide.

## Gestion de l'état

- **État global** : uniquement le token d'authentification, via `AuthContext` (Context API + `useState`).
- **État local** : chaque page/formulaire gère son propre état (`useState`) pour les champs de formulaire, les listes récupérées via l'API, les états de chargement et d'erreur — pas de store global type Redux, ce qui reste adapté à la taille de l'application.

## Appels API

Centralisés dans `src/services/api.js` : une instance `axios` unique (`baseURL` pointant vers l'API), avec des helpers exportés (`get`, `post`, `patch`, `del`) utilisés par les pages pour dialoguer avec les endpoints du backend (utilisateurs, projets, tâches, tags — voir la [documentation Swagger](#documentation-api)).

## Variables d'environnement

Vite charge automatiquement le bon fichier selon la commande, aucun code à écrire :

- `npm run dev` → charge `.env.development`
- `npm run build` → charge `.env.production`

Ni l'un ni l'autre n'est suivi par Git. Copier le modèle fourni pour démarrer :

```bash
cp .env.example .env.development
cp .env.example .env.production
```

| Variable       | Portée   | Description                      |
| -------------- | -------- | -------------------------------- |
| `VITE_API_URL` | Publique | Adresse de base de l'API backend |

> Vite n'expose que les variables préfixées par `VITE_` — elles finissent dans le bundle JS envoyé au navigateur, donc **aucun secret ne doit jamais commencer par `VITE_`**. Elles sont lues via `import.meta.env.VITE_API_URL`.

## Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est alors accessible sur [http://localhost:5173](http://localhost:5173).

> Le backend (API) doit être lancé séparément sur `http://localhost:3000` — voir le [README du backend](../backend/README.md).

## Tests

```bash
npm run test
```

Les tests (Vitest + Testing Library) couvrent :

- les formulaires de création (`CreateProject`, `CreateTag`, `CreateTask`)
- les formulaires d'édition (`EditProject`, `EditTag`, `EditTask`)
- le formulaire de connexion, y compris l'affichage d'une erreur API (`login`)
- la route protégée `PrivateRoute` (redirection si non authentifié)

## Qualité de code

```bash
npm run lint     # Analyse statique avec ESLint
npm run format   # Reformate le code avec Prettier
```

## Build de production

```bash
# Générer le build optimisé
npm run build

# Tester le build localement
npm run preview
```

`npm run build` génère un dossier `dist/` contenant les fichiers statiques minifiés (HTML/CSS/JS) prêts à être déployés sur un hébergeur. `npm run preview` sert ce build localement pour le tester avant livraison.

## Documentation API

Une fois le backend démarré :

```text
http://localhost:3000/api-docs
```

Swagger permet de visualiser les endpoints, leurs paramètres et réponses, et de tester les routes directement depuis le navigateur.
