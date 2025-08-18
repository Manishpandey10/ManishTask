"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var bcryptjs_1 = require("bcryptjs");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var jsonwebtoken_1 = require("jsonwebtoken");
var app = (0, express_1.default)();
var PORT = 5000;
// ================== Middleware ==================
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // React app
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(body_parser_1.default.json());
// ================== MongoDB Connection ==================
mongoose_1.default
    .connect("mongodb+srv://admin:admin123@cluster0expmanish.izoem.mongodb.net/User?retryWrites=true&w=majority&appName=Cluster0ExpManish")
    .then(function () { return console.log("✅ MongoDB Connected"); })
    .catch(function (err) { return console.error("DB Error:", err); });
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
var User = mongoose_1.default.model("User", UserSchema);
// ================== Validation Functions ==================
var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var validateRegisterInput = function (name, email, password) {
    var errors = {};
    // Name validation
    if (!name || !name.trim()) {
        errors.name = "Name is required";
    }
    else if (name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters long";
    }
    else if (name.trim().length > 50) {
        errors.name = "Name must be less than 50 characters";
    }
    // Email validation
    if (!email || !email.trim()) {
        errors.email = "Email is required";
    }
    else if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address";
    }
    // Password validation
    if (!password) {
        errors.password = "Password is required";
    }
    else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }
    else if (password.length > 100) {
        errors.password = "Password must be less than 100 characters";
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors,
    };
};
var validateLoginInput = function (email, password) {
    var errors = {};
    // Email validation
    if (!email || !email.trim()) {
        errors.email = "Email is required";
    }
    else if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address";
    }
    // Password validation
    if (!password) {
        errors.password = "Password is required";
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors,
    };
};
// ================== Routes ==================
// Register Route
app.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, validation, trimmedName, trimmedEmail, existingUserByEmail, existingUserByName, hashedPassword, user, err_1, duplicateField, validationErrors_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                validation = validateRegisterInput(name, email, password);
                if (!validation.isValid) {
                    res
                        .status(400)
                        .json({ error: "Validation failed", details: validation.errors });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                trimmedName = name.trim();
                trimmedEmail = email.trim().toLowerCase();
                return [4 /*yield*/, User.findOne({ email: trimmedEmail })];
            case 2:
                existingUserByEmail = _b.sent();
                if (existingUserByEmail) {
                    res.status(400).json({ error: "User with this email already exists" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.findOne({ name: trimmedName })];
            case 3:
                existingUserByName = _b.sent();
                if (existingUserByName) {
                    res.status(400).json({ error: "Username is already taken" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 12)];
            case 4:
                hashedPassword = _b.sent();
                user = new User({
                    name: trimmedName,
                    email: trimmedEmail,
                    password: hashedPassword,
                });
                return [4 /*yield*/, user.save()];
            case 5:
                _b.sent();
                res.status(201).json({
                    message: "User registered successfully",
                    user: { name: user.name, email: user.email },
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                console.error("Register error:", err_1);
                // Handle MongoDB duplicate key errors
                if (err_1.code === 11000) {
                    duplicateField = Object.keys(err_1.keyPattern)[0];
                    if (duplicateField === "email") {
                        res.status(400).json({ error: "User with this email already exists" });
                    }
                    else if (duplicateField === "name") {
                        res.status(400).json({ error: "Username is already taken" });
                    }
                    else {
                        res.status(400).json({ error: "User already exists" });
                    }
                    return [2 /*return*/];
                }
                // Handle validation errors
                if (err_1.name === "ValidationError") {
                    validationErrors_1 = {};
                    Object.keys(err_1.errors).forEach(function (key) {
                        validationErrors_1[key] = err_1.errors[key].message;
                    });
                    res
                        .status(400)
                        .json({ error: "Validation failed", details: validationErrors_1 });
                    return [2 /*return*/];
                }
                res.status(500).json({ error: "Something went wrong while registering" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Login Route
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, validation, trimmedEmail, user, isMatch, token, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                validation = validateLoginInput(email, password);
                if (!validation.isValid) {
                    res
                        .status(400)
                        .json({ error: "Validation failed", details: validation.errors });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                trimmedEmail = email.trim().toLowerCase();
                return [4 /*yield*/, User.findOne({ email: trimmedEmail })];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(400).json({ error: "Invalid email or password" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 3:
                isMatch = _b.sent();
                if (!isMatch) {
                    res.status(400).json({ error: "Invalid email or password" });
                    return [2 /*return*/];
                }
                token = jsonwebtoken_1.default.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });
                // Send token in HTTP-only cookie
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false, // set true in production with HTTPS
                    sameSite: "strict",
                });
                res.json({
                    message: "🎉 Login successful",
                    user: { name: user.name, email: user.email },
                });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _b.sent();
                console.error("Login error:", err_2);
                res.status(500).json({ error: "Something went wrong while logging in" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Logout Route
app.post("/logout", function (req, res) {
    res.clearCookie("token");
    res.json({ message: "👋 Logged out successfully" });
});
// User details route - Simple version using email from request body
app.post("/me", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                if (!email || !email.trim()) {
                    res.status(400).json({ error: "Email is required" });
                    return [2 /*return*/];
                }
                if (!emailRegex.test(email.trim())) {
                    res.status(400).json({ error: "Invalid email format" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.findOne({
                        email: email.trim().toLowerCase(),
                    }).select("name email")];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                res.json({ name: user.name, email: user.email });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error("Error fetching user:", err_3);
                res.status(500).json({ error: "Server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Health check route
app.get("/health", function (req, res) {
    res.json({
        status: "Server is running",
        timestamp: new Date().toISOString(),
    });
});
// ================== Error Handling Middleware ==================
app.use(function (err, req, res, next) {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});
// Handle 404 routes
app.use(function (req, res) {
    res.status(404).json({ error: "Route not found" });
});
// ================== Start Server ==================
app.listen(PORT, function () {
    return console.log("\uD83D\uDE80 Server running on http://localhost:".concat(PORT));
});
