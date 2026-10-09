# Memoria — Gestion de Mémoire

Application web de gestion de mémoires universitaires (étudiants, encadrants, jury).
Stack : **Next.js 16** (App Router), **NextAuth v4**, **Prisma 6 + MySQL**, **TypeScript**, **Tailwind CSS v4**.

## Prérequis

- Node.js 20+
- MySQL 8+ (service démarré sur `localhost:3306`)
- npm

## Installation

```bash
npm install
```

> Le script `postinstall` exécute `prisma generate` automatiquement.

## Configuration

Créez un fichier `.env` à la racine (le modèle est fourni) :

```env
# .env
DATABASE_URL="mysql://UTILISATEUR:MOT_DE_PASSE@localhost:3306/memoire_db"
NEXTAUTH_SECRET="un-secret-aleatoire-de-plus-de-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"
```

Générez un vrai secret avec : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Initialisation de la base

```bash
# Crée/synchronise les tables (User, Memoire, Section)
npx prisma db push

# Insère les données de test (répétable sans doublons)
npm run seed
```

## Lancement

```bash
npm run dev        # développement (http://localhost:3000)
npm run build      # build de production
npm start          # serveur de production
npm run lint       # analyse statique ESLint
```

## Comptes de test

| Rôle      | Email                  | Mot de passe |
|-----------|------------------------|--------------|
| Admin     | admin@memoire.com      | admin123     |
| Encadrant | dr.martin@memoire.com  | super123     |
| Étudiant  | etudiant@memoire.com   | student123   |

## Structure

```
app/
  api/auth/[...nextauth]/route.ts   # Endpoints NextAuth
  login/page.tsx                    # Page de connexion (credentials)
  dashboard/page.tsx                # Tableau de bord (protégé)
lib/
  auth.ts                           # Configuration NextAuth + CredentialsProvider
  prisma.ts                         # Instance unique PrismaClient
prisma/
  schema.prisma                     # Modèle de données (User, Memoire, Section)
  seed.ts                           # Données de test
proxy.ts                            # Protection des routes (/dashboard)
```

## Sécurité des routes

Le fichier `proxy.ts` (convention Next 16, remplace `middleware.ts`) protège
`/dashboard/:path*` : un utilisateur non connecté est redirigé vers `/login`.
