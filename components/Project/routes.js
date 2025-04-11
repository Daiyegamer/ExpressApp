const express = require("express");
const router = express.Router();
const { getAllProjects, addProject, deleteProject, getProjectsAPI } = require("./controller");

// Middleware to check admin
const checkAdmin = (req, res, next) => {
  if (req.session?.loggedIn && req.session?.isAdmin) {
    return next();
  } else {
    return res.redirect("/user/login");
  }
};

// Admin routes
router.get("/", checkAdmin, getAllProjects);
router.post("/add/submit", checkAdmin, addProject);
router.get("/delete/:name", checkAdmin, deleteProject);

// Public route
router.get("/api/projects", getProjectsAPI);

module.exports = router;
