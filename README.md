# Ithri Fresh Juice — Merchandiser & Admin System

## Structure
```
ithri/
├── shared/
│   ├── style.css
│   └── firebase-config.js   # Your Firebase project credentials live here
├── merchandiser/
│   ├── index.html           # Location login
│   ├── off-days.html        # First-login off-days setup
│   ├── dashboard.html       # Stock profile, clock in/out, supply confirmation banner
│   ├── stock.html           # Closing stock + sales + discrepancy + low stock
│   ├── history.html         # Sales history + Supply history (tabs)
│   └── manifest.json
└── admin/
    ├── index.html           # Admin login
    └── dashboard.html       # Overview, Notifications, Locations, Supply Stock,
                              # Reports & History, Settings
```

## Firestore Collections
- `locations/{id}` — name, password, products (total ever supplied), currentStock (live running stock),
  thresholds (per-product restock trigger), offDays
- `locations/{id}/logs/{date}` — daily clock in/out + sales report
- `supplyRequests/{id}` — admin-initiated stock additions awaiting merchandiser confirmation
- `notifications/{id}` — low_stock, discrepancy, supply_disputed alerts for the admin
- `admin/settings` — companyPassword, whatsappNumber

## New in this version
1. **Custom restock thresholds** — Admin → Supply Stock tab → "Set Restock Thresholds".
   Set an exact unit count per product per location instead of a fixed 20%.
2. **Full history for both sides** — Merchandiser History page now has Sales History and
   Supply History tabs. Admin Reports tab has the same split.
3. **Admin stock correction** — Admin → Supply Stock tab → "Edit / Correct Stock" lets the
   admin directly overwrite currentStock figures to fix discrepancies.
4. **Additive stock** — Confirmed supply requests add to existing currentStock rather than
   overwriting it. Both admin and merchandiser see the live running total.
5. **Supply confirmation flow** — When admin sends a supply, it goes into `supplyRequests`
   with status `pending_confirmation` and is NOT yet added to stock. The merchandiser sees
   a banner on their dashboard and must tap "Yes, I received this" (applies it to stock) or
   "Not correct" (flags it as `disputed`, notifies admin). Admin can then correct & resend
   or cancel from the "Pending/Disputed Supply Requests" panel.

## Setup
1. Firebase project already configured in `shared/firebase-config.js`.
2. Make sure Firestore and Storage are enabled in the Firebase Console.
3. Open `admin/index.html` first to set the admin password and add locations.
4. Open `merchandiser/index.html` on merchandiser devices.

## Recommended Firestore Security Rules (dev only — tighten for production)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /locations/{locId} {
      allow read, write: if true;
      match /logs/{logId} { allow read, write: if true; }
    }
    match /supplyRequests/{id} { allow read, write: if true; }
    match /notifications/{id} { allow read, write: if true; }
    match /admin/{doc} { allow read, write: if true; }
  }
}
```
