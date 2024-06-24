const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Middleware to verify API key
function verifyApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (typeof apiKey !== "undefined") {
    db.query(
      "SELECT * FROM users WHERE api_key = ?",
      apiKey,
      (err, results) => {
        if (err || results.length == 0) {
          res.status(403).json({ error: "Invalid API key" });
        } else {
          req.user = results[0];
          next();
        }
      }
    );
  } else {
    res.status(403).json({ error: "API key is required" });
  }
}

// Retrieve user profile
router.post("/api/public/profile", verifyApiKey, (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
});

// Retrieve candidates for user with API key
router.get("/api/public/candidate", verifyApiKey, (req, res) => {
  const user_id = req.user.id;

  db.query(
    "SELECT * FROM candidates WHERE user_id = ?",
    user_id,
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving candidates" });
      } else {
        res.status(200).json({ candidates: results });
      }
    }
  );
});

module.exports = router;
