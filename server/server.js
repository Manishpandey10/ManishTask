import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React app
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// MongoDB Connection
mongoose
mongoose.connect(
  "mongodb+srv://admin:admin123@cluster0expmanish.izoem.mongodb.net/User?retryWrites=true&w=majority&appName=Cluster0ExpManish"
)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Register Route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "❌ User already exists" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "❌ User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "❌ Invalid password" });
  }

  res.json({ message: "🎉 Login successful" });
});

// Logout Route
app.post("/logout", (req, res) => {
  // If you are not using sessions/tokens, just send success
  res.json({ message: "User logged out successfully" });

});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
