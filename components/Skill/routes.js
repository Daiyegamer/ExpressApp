const express = require("express");
const router = express.Router();
const { getAllSkills, addSkill, deleteSkill, getSkillsAPI} = require("./controller");  // Correct path to controller

// Admin Routes for Skills
router.get("/", getAllSkills); // Render admin skills page
router.post("/add/submit", addSkill); // Handle form submission to add a new skill
router.get("/delete/:name", deleteSkill); // Handle deleting a skill by name (using GET for link)
router.get("/api/skills", getSkillsAPI);  

// API Route to fetch all skills as JSON


module.exports = router;
