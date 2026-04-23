const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "ctf.db");

if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

const realPassword = "phi_is_1618";

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL
  )`);
  const seedUsers = [
    [1, "admin"],
    [2, "guest"],
    [3, "fib_fan"],
    [4, "newton"],
  ];
  const stmt = db.prepare(`INSERT INTO users (id, username) VALUES (?, ?)`);
  for (const row of seedUsers) stmt.run(row);
  stmt.finalize();

  db.run(`CREATE TABLE admin_credentials (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`);
  db.run(
    `INSERT INTO admin_credentials (id, username, password) VALUES (?, ?, ?)`,
    [1, "admin", realPassword],
  );
});

db.close((err) => {
  if (err) {
    console.error("Error closing DB:", err);
    process.exit(1);
  }
  console.log("─".repeat(60));
  console.log("CTF database initialized at:", DB_PATH);
  console.log("─".repeat(60));
  console.log(`  users table                : admin, guest, fib_fan, newton`);
  console.log(`  credentials table          : admin_credentials`);
  console.log(`  REAL admin password (flag) : ${realPassword}`);
  console.log("─".repeat(60));
  console.log("Keep this output private — it is the challenge answer key.");
});
