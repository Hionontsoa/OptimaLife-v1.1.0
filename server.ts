import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("optimalife.db");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    pin TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'income' or 'expense'
    icon TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL NOT NULL,
    category_id INTEGER,
    description TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    type TEXT NOT NULL, -- 'income' or 'expense'
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    due_date TEXT,
    reminder_time TEXT,
    priority TEXT DEFAULT 'medium'
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    deadline TEXT,
    icon TEXT DEFAULT 'Target'
  );

  CREATE TABLE IF NOT EXISTS goal_contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(goal_id) REFERENCES goals(id)
  );

  CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    acquisition_cost REAL NOT NULL,
    current_value REAL NOT NULL,
    type TEXT, -- 'stock', 'crypto', 'real_estate', etc.
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrations (outside of db.exec)
try {
  db.prepare("ALTER TABLE tasks ADD COLUMN reminder_time TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE transactions ADD COLUMN user_id INTEGER").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE tasks ADD COLUMN user_id INTEGER").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE goals ADD COLUMN user_id INTEGER").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE goals ADD COLUMN icon TEXT DEFAULT 'Target'").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE users ADD COLUMN currency TEXT DEFAULT '€'").run();
} catch (e) {}

// Seed default categories if empty
const catCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (catCount.count === 0) {
  const insertCat = db.prepare("INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)");
  insertCat.run("Nourriture", "expense", "Utensils", "#EF4444");
  insertCat.run("Transport", "expense", "Car", "#3B82F6");
  insertCat.run("Études", "expense", "GraduationCap", "#8B5CF6");
  insertCat.run("Trading", "income", "TrendingUp", "#10B981");
  insertCat.run("Salaire", "income", "Wallet", "#10B981");
  insertCat.run("Loisirs", "expense", "Gamepad", "#F59E0B");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Middleware for Auth
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      req.userId = decoded.userId;
      next();
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const info = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashedPassword);
      const token = jwt.sign({ userId: info.lastInsertRowid }, JWT_SECRET);
      res.json({ token, userId: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "Username already exists" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, userId: user.id });
  });

  // API Routes
  app.get("/api/summary", authenticate, (req: any, res) => {
    const user = db.prepare("SELECT currency FROM users WHERE id = ?").get(req.userId) as { currency: string };
    const income = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE type = 'income' AND user_id = ?").get(req.userId) as { total: number };
    const expense = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE type = 'expense' AND user_id = ?").get(req.userId) as { total: number };
    const balance = (income.total || 0) - (expense.total || 0);
    
    const recentTransactions = db.prepare(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.user_id = ?
      ORDER BY date DESC LIMIT 5
    `).all(req.userId);

    res.json({
      balance,
      income: income.total || 0,
      expense: expense.total || 0,
      recentTransactions,
      currency: user?.currency || '€'
    });
  });

  app.get("/api/transactions", authenticate, (req: any, res) => {
    const transactions = db.prepare(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.user_id = ?
      ORDER BY date DESC
    `).all(req.userId);
    res.json(transactions);
  });

  app.post("/api/transactions", authenticate, (req: any, res) => {
    const { amount, category_id, description, type, date } = req.body;
    const info = db.prepare("INSERT INTO transactions (amount, category_id, description, type, date, user_id) VALUES (?, ?, ?, ?, ?, ?)")
      .run(amount, category_id, description, type, date || new Date().toISOString(), req.userId);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.get("/api/finance/category-stats", authenticate, (req: any, res) => {
    const stats = db.prepare(`
      SELECT c.name, SUM(t.amount) as value, c.color
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.type = 'expense'
      GROUP BY c.id
    `).all(req.userId);
    res.json(stats);
  });

  app.get("/api/stats/activity", authenticate, (req: any, res) => {
    const { period } = req.query;
    let query = "";

    if (period === 'week') {
      // Last 7 days
      query = `
        SELECT strftime('%d/%m', date) as label,
               SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
               SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
        FROM transactions
        WHERE user_id = ? AND date >= date('now', '-7 days')
        GROUP BY label
        ORDER BY date ASC
      `;
    } else if (period === 'month') {
      // Last 30 days grouped by week or just last 30 days?
      // Let's do daily for month too, but maybe it's too many points.
      // Let's do daily for the last 30 days.
      query = `
        SELECT strftime('%d/%m', date) as label,
               SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
               SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
        FROM transactions
        WHERE user_id = ? AND date >= date('now', '-30 days')
        GROUP BY label
        ORDER BY date ASC
      `;
    } else {
      // Year: Last 12 months
      query = `
        SELECT strftime('%m/%Y', date) as label,
               SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
               SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
        FROM transactions
        WHERE user_id = ? AND date >= date('now', '-1 year')
        GROUP BY label
        ORDER BY date ASC
      `;
    }

    const data = db.prepare(query).all(req.userId);
    res.json(data);
  });

  app.get("/api/tasks", authenticate, (req: any, res) => {
    const tasks = db.prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY completed ASC, due_date ASC").all(req.userId);
    res.json(tasks);
  });

  app.post("/api/tasks", authenticate, (req: any, res) => {
    const { title, due_date, priority, reminder_time } = req.body;
    const info = db.prepare("INSERT INTO tasks (title, due_date, priority, reminder_time, user_id) VALUES (?, ?, ?, ?, ?)")
      .run(title, due_date, priority, reminder_time, req.userId);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/tasks/:id", authenticate, (req: any, res) => {
    const { completed } = req.body;
    db.prepare("UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?").run(completed ? 1 : 0, req.params.id, req.userId);
    res.json({ success: true });
  });

  app.delete("/api/tasks/:id", authenticate, (req: any, res) => {
    db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
    res.json({ success: true });
  });

  app.delete("/api/goals/:id", authenticate, (req: any, res) => {
    const goal = db.prepare("SELECT id FROM goals WHERE id = ? AND user_id = ?").get(req.params.id, req.userId);
    if (!goal) return res.status(403).json({ error: "Forbidden" });
    
    db.prepare("DELETE FROM goals WHERE id = ?").run(req.params.id);
    db.prepare("DELETE FROM goal_contributions WHERE goal_id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/transactions/:id", authenticate, (req: any, res) => {
    db.prepare("DELETE FROM transactions WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
    res.json({ success: true });
  });

  app.get("/api/investments", authenticate, (req: any, res) => {
    const investments = db.prepare("SELECT * FROM investments WHERE user_id = ? ORDER BY date DESC").all(req.userId);
    res.json(investments);
  });

  app.post("/api/investments", authenticate, (req: any, res) => {
    const { name, acquisition_cost, current_value, type } = req.body;
    const info = db.prepare("INSERT INTO investments (name, acquisition_cost, current_value, type, user_id) VALUES (?, ?, ?, ?, ?)")
      .run(name, acquisition_cost, current_value, type, req.userId);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/investments/:id", authenticate, (req: any, res) => {
    const { current_value } = req.body;
    db.prepare("UPDATE investments SET current_value = ? WHERE id = ? AND user_id = ?").run(current_value, req.params.id, req.userId);
    res.json({ success: true });
  });

  app.delete("/api/investments/:id", authenticate, (req: any, res) => {
    db.prepare("DELETE FROM investments WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
    res.json({ success: true });
  });

  app.get("/api/goals", authenticate, (req: any, res) => {
    const goals = db.prepare("SELECT * FROM goals WHERE user_id = ?").all(req.userId);
    res.json(goals);
  });

  app.get("/api/goals/:id", authenticate, (req: any, res) => {
    const goal = db.prepare("SELECT * FROM goals WHERE id = ? AND user_id = ?").get(req.params.id, req.userId);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    
    const contributions = db.prepare("SELECT * FROM goal_contributions WHERE goal_id = ? ORDER BY date DESC").all(req.params.id);
    res.json({ ...goal, contributions });
  });

  app.post("/api/goals", authenticate, (req: any, res) => {
    const { title, target_amount, deadline, icon } = req.body;
    const info = db.prepare("INSERT INTO goals (title, target_amount, deadline, user_id, icon) VALUES (?, ?, ?, ?, ?)")
      .run(title, target_amount, deadline, req.userId, icon || 'Target');
    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/goals/:id/contributions", authenticate, (req: any, res) => {
    const { amount } = req.body;
    const goalId = req.params.id;

    // Verify goal belongs to user
    const goal = db.prepare("SELECT id FROM goals WHERE id = ? AND user_id = ?").get(goalId, req.userId);
    if (!goal) return res.status(403).json({ error: "Forbidden" });

    const dbTransaction = db.transaction(() => {
      db.prepare("INSERT INTO goal_contributions (goal_id, amount) VALUES (?, ?)").run(goalId, amount);
      db.prepare("UPDATE goals SET current_amount = current_amount + ? WHERE id = ?").run(amount, goalId);
    });

    dbTransaction();
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.get("/api/user/settings", authenticate, (req: any, res) => {
    const user = db.prepare("SELECT currency FROM users WHERE id = ?").get(req.userId) as any;
    res.json({ currency: user.currency || '€' });
  });

  app.patch("/api/user/settings", authenticate, (req: any, res) => {
    const { currency } = req.body;
    db.prepare("UPDATE users SET currency = ? WHERE id = ?").run(currency, req.userId);
    res.json({ success: true });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
