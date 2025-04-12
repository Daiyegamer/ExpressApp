const express = require("express");
const router = express.Router();
const { getAllProjects, addProject, deleteProject } = require("./controller");

// ✅ React support: Accepts JSON
router.post("/add", addProject); // React sends fetch POST here

// ✅ Middleware for Pug/admin pages
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
router.get("/", checkAdmin, getAllProjects);              // Admin view
router.post("/add/submit", checkAdmin, addProject);       // Pug form submit
router.get("/delete/:name", checkAdmin, deleteProject);   // Pug delete

module.exports = router;
