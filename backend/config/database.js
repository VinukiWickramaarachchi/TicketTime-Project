const sqlite3 = require("sqlite3").verbose();

// Creating the Database
const db = new sqlite3.Database("./sales.db", (err) => {
  if (err) console.error("Error opening database:", err.message);
  else {
    console.log("Connected to SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        quantity INTEGER NOT NULL
      )`,
      (err) => {
        if (err) console.error("Error creating table:", err.message);
        else console.log("Sales table initialized.");
      }
    );
  }
});

module.exports = db;
