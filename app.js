// ═══════════════════════════════════════════════════════
//  PUP Maragondon — Attendance System  |  app.js  v3.0
// ═══════════════════════════════════════════════════════

/* ── localStorage wrapper ── */
const DB = {
  get(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  del(key)      { localStorage.removeItem(key); }
};

/* ── Security questions ── */
const SECURITY_QUESTIONS = [
  "What is your favorite food?",
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "In what city were you born?",
  "What is the name of your elementary school?"
];

/* ── Simple but consistent password hash (djb2 variant) ──
   Passwords are NEVER stored as plaintext.
   Both registration AND login go through this function.      */
function hashPassword(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return "p_" + (h >>> 0).toString(36);
}

/* ── PIN hash (kept separate so a PIN ≠ password collision) ── */
function hashPin(s) {
  let h = 99991;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return "n_" + (h >>> 0).toString(36);
}

/* ── Auth helpers ── */
function requireRole(role) {
  const sess = DB.get("session", null);
  if (!sess || (role && sess.role !== role)) {
    window.location.href = "login.html";
    return null;
  }
  return sess;
}

function logout() {
  DB.del("session");
  window.location.href = "login.html";
}

/* ── User CRUD ── */
function userKey(role, id) { return role + ":" + id.trim().toUpperCase(); }

function findUser(role, id) {
  const users = DB.get("users", {});
  return users[userKey(role, id)] || null;
}

function saveUser(user) {
  const users = DB.get("users", {});
  users[userKey(user.role, user.id)] = user;
  DB.set("users", users);
}

function allUsersByRole(role) {
  const users = DB.get("users", {});
  return Object.values(users).filter(u => u.role === role);
}

/* ── Date helpers ── */
function today() { return new Date().toISOString().slice(0, 10); }
function fmtDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-PH", { year:"numeric", month:"short", day:"numeric" });
}

/* ── UI helper ── */
function showMsg(el, text, type) {
  if (!el) return;
  el.className = "msg show " + (type || "info");
  el.textContent = text;
}

/* ── CSV escaping (UTF-8 safe, BOM added by downloadFile) ── */
function csvEscape(v) {
  v = String(v ?? "")
    .replace(/✓|✔|☑/g, "Yes").replace(/✗|✘|☒/g, "No")
    .replace(/[—–]/g, "-").replace(/[""]/g, '"').replace(/['']/g, "'")
    .replace(/…/g, "...").replace(/[^\x00-\x7E]/g, "");
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}

/* ── File download (adds UTF-8 BOM for CSV/Excel compatibility) ── */
function downloadFile(filename, content, mime) {
  const bom = (mime || "").includes("csv") || filename.endsWith(".csv") ? "\uFEFF" : "";
  const blob = new Blob([bom + content], { type: (mime || "text/plain") + ";charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── XLSX download with auto column widths ──
   Uses SheetJS (loaded via CDN in pages that need it).
   Falls back to CSV if SheetJS isn't loaded.               */
function downloadXLSX(rows, colWidths, sheetName, filename) {
  if (window.XLSX) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = colWidths.map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet1");
    XLSX.writeFile(wb, filename);
  } else {
    // Fallback: CSV
    const csv = rows.map(r => r.map(c => csvEscape(String(c ?? ""))).join(",")).join("\r\n");
    downloadFile(filename.replace(/\.xlsx$/i, ".csv"), csv, "text/csv");
  }
}

/* ════════════════════════════════════════════════════════
   SEED — create demo accounts on very first run only
   (only runs if the "users" key has never been set)
════════════════════════════════════════════════════════ */
(function seed() {
  if (DB.get("users", null) !== null) return; // already seeded or has real users

  const demo = {
    role: "faculty", id: "T-001",
    name: "Prof. Juan Dela Cruz",
    age: "42", bday: "1983-05-10", sex: "Male",
    email: "jdelacruz@pup.edu.ph", address: "Maragondon, Cavite",
    passwordHash: hashPassword("teacher123"),
    pinHash: hashPin("1234"),
    qIndexes: [0, 2], qAnswers: ["adobo", "santos"],
    courses: ["BSIT", "BSCS"],
    sections: ["BSIT 1-1", "BSIT 2-1"]
  };

  const demoStudent = {
    role: "student", id: "2024-00001",
    name: "Maria Santos",
    age: "19", bday: "2005-08-12", sex: "Female",
    email: "msantos@pup.edu.ph", phone: "0917-123-4567",
    parent: "Ana Santos", address: "Maragondon, Cavite",
    section: "BSIT 1-1", course: "BSIT",
    passwordHash: hashPassword("student123"),
    pinHash: hashPin("1234"),
    qIndexes: [1, 3], qAnswers: ["whiskers", "manila"]
  };

  DB.set("users", {
    [userKey("faculty",  "T-001")]:       demo,
    [userKey("student",  "2024-00001")]:  demoStudent
  });
})();
