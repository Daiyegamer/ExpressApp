const express = require("express");
const router = express.Router();
const { getAllSkills, addSkill, deleteSkill } = require("./controller");

// Middleware to protect admin routes
const checkAdmin = (req, res, next) => {
  if (req.session?.loggedIn && req.session?.isAdmin) {
    return next();
  } else {
    return res.redirect("/user/login");
  }
};

// Admin Routes for Skills (only accessible to logged-in admins)
router.get("/", checkAdmin, getAllSkills);             // Render admin skills page
router.post("/add/submit", checkAdmin, addSkill);      // Handle adding a skill
router.get("/delete/:name", checkAdmin, deleteSkill);  // Handle deleting a skill

module.exports = router;
