const express = require("express");
const router = express.Router();
const { getAllSkills, addSkill, deleteSkill } = require("./controller");

// ✅ Public route for React
router.post("/add", addSkill); // React sends JSON here

// ✅ Middleware to protect admin views
const checkAdmin = (req, res, next) => {
  if (req.session?.loggedIn && req.session?.isAdmin) {
    return next();
  }

  if (req.headers.accept?.includes("application/json")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  return res.redirect("/user/login");
};


// Admin-only Pug routes
router.get("/", checkAdmin, getAllSkills);             // Admin view
router.post("/add/submit", checkAdmin, addSkill);      // Pug form submit
router.get("/delete/:name", checkAdmin, deleteSkill);  // Pug delete

module.exports = router;
