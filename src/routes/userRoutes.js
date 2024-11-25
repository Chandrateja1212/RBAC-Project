const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();

// Only admin can access this route
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ 
        success: true,
        message: "Welcome Admin",
        user: req.user
    });
});

// Both admin and manager can access this route
router.get("/manager", verifyToken, authorizeRoles("admin", "manager"), (req, res) => {
    res.json({ 
        success: true,
        message: "Welcome Manager",
        user: req.user
    });
});

// All authenticated users can access this route
router.get("/user", verifyToken, authorizeRoles("admin", "manager", "user"), (req, res) => {
    res.json({ 
        success: true,
        message: "Welcome User",
        user: req.user
    });
});

module.exports = router;




