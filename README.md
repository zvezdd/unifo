# Kazakhstan University DataHub

React + Vite + TypeScript + Tailwind + Firebase starter for a web-based hub of Kazakhstan universities. Includes search/filter, comparison, 3D tour embeds, and an admin panel with Firestore-backed CRUD (with in-memory fallback when Firebase is not configured).

## Getting started

```bash
npm install
npm run dev
```

## Environment (.env)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_PASSCODE=changeme   # optional simple guard for admin panel
```

When Firebase values are missing, the app serves and mutates in-memory dummy data so you can test the UI immediately.

## Features

- Home, universities list, university detail, program detail, comparison, and admin pages.
- Firestore helpers and seed loader with dummy dataset for Nazarbayev University, KBTU, and AITU.
- Search and filter by name/city/program, add to comparison (up to 3), and embed 3D tours via iframe.
- Admin panel to seed sample data and create universities/programs (writes to Firestore when configured).
- Tailwind CSS, responsive layout, loading/error states, and React Router 7 navigation.

## Scripts

- `npm run dev` — local development
- `npm run build` — type-check + production build
- `npm run preview` — preview build
- `npm run lint` — ESLint

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Vite settings

3. **Add Environment Variables:**
   In Vercel dashboard → Project Settings → Environment Variables, add:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_PASSCODE` (optional)

4. **Deploy:**
   - Vercel will automatically build and deploy
   - Your app will be live at `your-project.vercel.app`

**Note:** The `vercel.json` file is included for optimal routing configuration (SPA support).

### Firebase Hosting (Alternative)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select: dist as public directory, single-page app: Yes
npm run build
firebase deploy
```
