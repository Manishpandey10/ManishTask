import express from "express";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
const PORT = 5000;
// ================== Middleware ==================
app.use(cors({
    origin: "http://localhost:5173", // React app
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(bodyParser.json());
// ================== MongoDB Connection ==================
mongoose
    .connect("mongodb+srv://admin:admin123@cluster0expmanish.izoem.mongodb.net/User?retryWrites=true&w=majority&appName=Cluster0ExpManish")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ DB Error:", err));
const UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);
// ================== Routes ==================
// Register Route
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "❌ User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.json({ message: "✅ User registered successfully" });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "❌ Something went wrong while registering" });
    }
});
// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "❌ User not found" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "❌ Invalid password" });
            return;
        }
        res.json({ message: "🎉 Login successful" });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "❌ Something went wrong while logging in" });
    }
});
// Logout Route
app.post("/logout", (req, res) => {
    // If you are not using sessions/tokens, just send success
    res.json({ message: "👋 User logged out successfully" });
});
// ================== Start Server ==================
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
