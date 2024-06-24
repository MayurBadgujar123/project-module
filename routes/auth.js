const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);

  const newUser = { first_name, last_name, email, password_hash };
  db.query("INSERT INTO users SET ?", newUser, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error registering new user" });
    } else {
      res.status(201).json({ message: "User registered successfully" });
    }
  });
});

// Login endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    email,
    async (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      } else if (results.length == 0) {
        res.status(401).json({ error: "Email or password incorrect" });
      } else {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (passwordMatch) {
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.status(200).json({ token });
        } else {
          res.status(401).json({ error: "Email or password incorrect" });
        }
      }
    }
  );
});

module.exports = router;
