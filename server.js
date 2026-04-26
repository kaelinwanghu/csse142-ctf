const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "ctf.db");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.get('/favicon.png', (_, res) => res.sendFile(path.join(__dirname, 'favicon.png')));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'index.html')));

const db = new sqlite3.Database(DB_PATH);

// The real admin password lives in the admin_credentials table. Cache it at
// startup — login validation compares the typed password against this. The
// decoy in `users` is never used for auth; it exists only to mislead
// attackers who extract from `users` thinking they've found the creds.
let adminPassword = null;
db.get(
  `SELECT password FROM admin_credentials WHERE username = 'admin'`,
  (err, row) => {
    if (err || !row) return console.error("admin_credentials read failed:", err);
    adminPassword = row.password;
  },
);

// ─── TROLL ROUTES ───
const page = (f) => (_, res) => res.sendFile(path.join(__dirname, f));

app.get("/members",       page("members.html"));
app.get("/archive",       page("archive.html"));
app.get("/vault",         page("vault.html"));
app.get("/sacred-texts",  page("sacred-texts.html"));
app.get("/golden-records",page("golden-records.html"));
app.get("/inner-circle",  page("inner-circle.html"));
app.get("/sequencer",     page("sequencer.html"));
app.get("/ebmarah",       page("harambe.html"));

// ─── REAL ARCHIVE ROUTE ───
app.get("/fib0n4cc1", (req, res) => {
  if (req.headers["golden-ratio"] === "φ") {
    return res.sendFile(path.join(__dirname, "FIB_2584B.jpg"));
  }
  if ("golden-ratio" in req.headers) {
    return res.status(403).send("golden-ratio: false");
  }
  res.status(403).json({ error: "hmmm... missing header" });
});

app.post("/login", (req, res) => {
  const { username = "", password = "" } = req.body || {};

  // INTENTIONALLY VULNERABLE: string concatenation, no parameterization.
  const sql = `SELECT id, username FROM users WHERE username = '${username}'`;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.json({ ok: false, error: err.message });
    }
    if (!rows.length) {
      return res.json({ ok: false, error: "Unknown user" });
    }
    if (rows.length > 1) {
      return res.json({
        ok: false,
        error: rows.map((r) => r.username).join(", "),
      });
    }
    const row = rows[0];
    if (row.username !== "admin" || password !== adminPassword) {
      return res.json({ ok: false, error: row.username });
    }
    res.json({ ok: true, username: row.username });
  });
});

app.listen(PORT, () => {
  console.log(`FibFanatics CTF listening on http://localhost:${PORT}`);
});
