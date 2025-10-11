const express = require("express");
const path = require("path");

const app = express();

// Hide Express from headers for security
app.disable("x-powered-by");

app.use(express.json());

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('❌ ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env file');
  process.exit(1);
}

// Basic auth middleware for admin routes
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).send("Authentication required");
  }

  const credentials = Buffer.from(auth.slice(6), "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    next();
  } else {
    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).send("Invalid credentials");
  }
}

// In-memory storage for submissions (in production use a real database)
const submissions = new Map();

// API Routes
// Save student submission
app.post("/api/submissions", (req, res) => {
  try {
    const { studentId, exerciseId, code, passed, attempts } = req.body;

    if (!studentId || !exerciseId || code === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const key = `${studentId}-${exerciseId}`;
    const submission = {
      studentId,
      exerciseId,
      code,
      passed: passed || false,
      attempts: attempts || 1,
      timestamp: new Date().toISOString(),
    };

    submissions.set(key, submission);
    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all submissions (admin only)
app.get("/api/admin/submissions", requireAuth, (req, res) => {
  try {
    const allSubmissions = Array.from(submissions.values());

    // Group by student
    const byStudent = {};
    allSubmissions.forEach((sub) => {
      if (!byStudent[sub.studentId]) {
        byStudent[sub.studentId] = {};
      }
      byStudent[sub.studentId][sub.exerciseId] = sub;
    });

    res.json(byStudent);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get submissions for specific student
app.get("/api/submissions/:studentId", (req, res) => {
  try {
    const { studentId } = req.params;
    const studentSubmissions = {};

    for (const [key, submission] of submissions) {
      if (submission.studentId === studentId) {
        studentSubmissions[submission.exerciseId] = submission;
      }
    }

    res.json(studentSubmissions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin dashboard route
app.get("/admin", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin.html"));
});

app.use(express.static(path.join(__dirname, "../public")));

module.exports = app;
