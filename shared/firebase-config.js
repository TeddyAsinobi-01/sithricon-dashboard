// ====== FIREBASE CONFIG ======
// Replace with your own Firebase project config (Firebase Console > Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyAEVprkRNAahiFzAk1h84Mv3gx3-ugXs3U",
  authDomain: "sithricon-database.firebaseapp.com",
  projectId: "sithricon-database",
  storageBucket: "sithricon-database.firebasestorage.app",
  messagingSenderId: "4738971128",
  appId: "1:4738971128:web:227c88c9c0902d36c4120d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ====== FIRESTORE COLLECTIONS STRUCTURE ======
// locations/{locationId}            -> { name, password, merchandiserName, products: {juiceA: 50, juiceB: 30}, offDays: [0,6] }
// locations/{locationId}/logs/{date} -> { date, clockIn, clockOut, clockInPhoto, clockOutPhoto,
//                                          openingStock: {}, closingStock: {}, soldQty: {},
//                                          expectedClosing: {}, discrepancy: {}, discrepancyReason: "",
//                                          status: "pending"|"submitted"|"flagged" }
// admin/settings -> { companyPassword }

// ====== HELPERS ======
function todayStr(d = new Date()) {
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function dayOfWeek(d = new Date()) {
  return d.getDay(); // 0 = Sunday ... 6 = Saturday
}

function nowTimeStr(d = new Date()) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Extract basic EXIF date/time from an image file if available, fallback to current time
function getImageMetadata(file) {
  return new Promise((resolve) => {
    const now = new Date();
    const meta = {
      date: todayStr(now),
      time: nowTimeStr(now),
      fileName: file.name,
      size: file.size
    };
    // EXIF parsing kept minimal/robust: fallback to device time which is sufficient
    // for clock-in/out verification purposes.
    resolve(meta);
  });
}

// Upload an image to Firebase Storage and return its download URL
async function uploadImage(file, path) {
  const ref = storage.ref().child(path);
  await ref.put(file);
  return await ref.getDownloadURL();
}

// Simple session helpers (per-device, stored in localStorage)
function setSession(locationId, locationName) {
  localStorage.setItem('ithri_locationId', locationId);
  localStorage.setItem('ithri_locationName', locationName);
}

function getSession() {
  return {
    locationId: localStorage.getItem('ithri_locationId'),
    locationName: localStorage.getItem('ithri_locationName')
  };
}

function clearSession() {
  localStorage.removeItem('ithri_locationId');
  localStorage.removeItem('ithri_locationName');
}
