# Ithri Fresh Juice — Merchandiser & Admin System

## Structure
```
ithri/
├── shared/
│   ├── style.css          # Design system (colors from Ithri logo)
│   └── firebase-config.js # Firebase setup + helper functions
├── merchandiser/
│   ├── index.html         # Location selection + login
│   ├── off-days.html       # First-login off-days setup
│   ├── dashboard.html      # Clock in/out with photo
│   ├── stock.html          # Closing stock + sales + discrepancy
│   ├── history.html        # Personal history
│   └── manifest.json       # PWA manifest (installable on phone)
└── admin/
    ├── index.html          # Admin login (sets password on first use)
    └── dashboard.html      # Overview, Locations, Stock Supply, Reports, Settings
```

## Setup Steps

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com → "Add project"
2. Enable **Firestore Database** (start in test mode, then secure with rules below)
3. Enable **Storage** (for clock-in/out photos)
4. Go to Project Settings → General → "Your apps" → Web app → copy the config object

### 2. Add your config
Open `shared/firebase-config.js` and replace the `firebaseConfig` placeholder values
with your real project's config (apiKey, authDomain, projectId, etc).

### 3. Host the files
Any static host works: Firebase Hosting, GitHub Pages (separate repos/folders for
merchandiser and admin if you want different URLs), Netlify, or Vercel.

### 4. First-time use
- **Admin**: open `admin/index.html`. The first password you type becomes the
  admin/company password — change it anytime in Settings.
- **Admin → Locations tab**: add each supermarket location (this becomes a
  login option on the merchandiser homepage). Default merchandiser password is "impu".
- **Admin → Supply Stock tab**: enter the products supplied and quantities for each location.
- **Merchandiser**: open `merchandiser/index.html`, pick their location, log in with
  "impu" (or whatever password the admin set). On first login they'll set their off days.

## How the discrepancy check works
expected closing = opening stock − sold quantity
If actual closing stock entered ≠ expected closing, the merchandiser is shown
a discrepancy alert and must give a reason before submitting. This reason is
visible to the admin in the Reports tab and on the Overview table.

## Recommended Firestore Security Rules (basic starting point)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /locations/{locId} {
      allow read: if true;
      allow write: if true; // tighten with Firebase Auth for production
      match /logs/{logId} {
        allow read, write: if true;
      }
    }
    match /admin/{doc} {
      allow read, write: if true;
    }
  }
}
```
**Note:** These open rules are for development only. For production, add
Firebase Authentication (e.g. anonymous auth + custom claims, or admin email/password)
and restrict writes accordingly — especially the `admin/settings` and `products` fields,
which only the admin should be able to edit.

## Next features to build
- Push notifications for flagged discrepancies
- Export reports to Excel/CSV
- Photo gallery view of clock-in/out images per location
- Multi-admin roles
