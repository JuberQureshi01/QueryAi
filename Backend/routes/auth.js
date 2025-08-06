// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// === SIGN IN WITH GOOGLE ===
router.post('/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, create them.
            // Note: We are not hashing a password because they use Google to log in.
            // You might want to generate a random password or leave it empty.
            const randomPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                email,
                password: hashedPassword, // Assign a random password
                // You could add name and picture fields to your User model too!
            });
            await user.save();
        }

        // Create a JWT for our own app
        const payload = { userId: user.id };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token: jwtToken });

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Google authentication failed' });
    }
});

// === REGISTER A NEW USER ===
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
    res.send("Wroking auth");
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// === LOGIN A USER ===
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
