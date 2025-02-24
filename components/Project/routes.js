const express = require("express");
const router = express.Router();
const { getAllProjects, addProject, deleteProject, getProjectsAPI} = require("./controller");  // Correct import for controller

// Admin Routes for Projects
router.get("/", getAllProjects); // Render admin projects page
router.post("/add/submit", addProject); // Handle form submission to add a new project
router.get("/delete/:name", deleteProject); // Handle deleting a project by name
router.get("/api/projects", getProjectsAPI);  

// API Route to fetch all projects as JSON


module.exports = router;