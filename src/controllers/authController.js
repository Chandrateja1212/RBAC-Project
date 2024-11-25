const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const rateLimit = require("express-rate-limit");
const User = require("../models/userModel");

// Create rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    }
});

const validateRegistration = (username, password) => {
    const errors = [];
    
    if (!validator.isLength(username, { min: 3, max: 30 })) {
        errors.push("Username must be between 3 and 30 characters");
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        errors.push("Password must contain at least 8 characters, including uppercase, lowercase, number and special character");
    }

    return errors;
};

const register = async(req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // Enhanced validation using validator
        const validationErrors = validateRegistration(username, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                success: false,
                errors: validationErrors 
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // Hash password with increased security
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || 'user'
        });
        
        await newUser.save();

        // Create token for immediate login
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour
        });
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                username: newUser.username,
                role: newUser.role
            },
            token // Include token in response for flexibility
        });
        
    } catch(err) {
        console.error("Registration error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error during registration"
        });
    }
};

const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both username and password"
            });
        }

        // Find user with lean() for better performance
        const user = await User.findOne({ username }).lean();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                username: user.username,
                role: user.role
            },
            token
        });

    } catch(err) {
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error during login"
        });
    }
};

const logout = async(req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token');
        
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch(err) {
        console.error("Logout error:", err);
        res.status(500).json({
            success: false,
            message: "Error during logout"
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    loginLimiter // Export for use in routes
};