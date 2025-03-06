import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/Users.js";

const router = express.Router();

// Register API
/*
  API: /api/user/register
  Desc: User Signup
  Method: POST
  Access: Public
  Validation: email is unique, password strength
*/
router.post("/register", async (req, res) => {
  try {
    // Check if the email is already registered
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password with a salt round of 12
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create a new user using the provided request data, tokens, and hashed password
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond to the client after successful registration
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error. Try again." });
  }
});

// Login API
/*
  API: /api/user/login
  Desc: User login
  Method: POST
  Access: Public
  Validation: valid email and password
*/
router.post("/login", async (req, res) => {
  try {
    const found = await User.findOne({ email: req.body.email });
    if (!found) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(req.body.password, found.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      user_id: found._id,
      email: found.email,
    };

    // Create a JWT token with a 1 hour expiry
    const token = jwt.sign(payload, "Revoke", { expiresIn: "1h" });
    res.status(200).json({ success: "Valid token", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error. Try again." });
  }
});

// Auth API
/*
  API: /api/user/auth
  Desc: JWT token auth
  Method: GET
  Access: Public
  Validation: valid token provided in the request headers
*/
router.get("/auth", async (req, res) => {
  try {
    const token = req.headers["auth-token"];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, "Revoke");
    res.status(200).json({ user_id: decoded.user_id });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Unauthorized or token expired." });
  }
});

export default router;
