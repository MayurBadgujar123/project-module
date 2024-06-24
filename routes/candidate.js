const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Add candidate endpoint
router.post("/candidate", verifyToken, (req, res) => {
  const { first_name, last_name, email } = req.body;
  const user_id = req.authData.id;
  const newCandidate = { first_name, last_name, email, user_id };

  db.query("INSERT INTO candidates SET ?", newCandidate, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error adding candidate" });
    } else {
      res.status(201).json({ message: "Candidate added successfully" });
    }
  });
});

// Get candidates for current user
router.get("/candidate", verifyToken, (req, res) => {
  const user_id = req.authData.id;

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
