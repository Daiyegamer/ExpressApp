const mongoose = require("mongoose");
const db = require("../../db"); // Shared db connection

// Set up the schema and model for skills
const SkillSchema = new mongoose.Schema({
  name: String,
  proficiency: String
}); 
const Skill = mongoose.model("Skill", SkillSchema);

// MongoDB functions

// Get all skills from the skills collection
async function getSkills() {
  await db.connect();  // Establish the DB connection
  return await Skill.find({});  // Fetch and return all skills as an array
}

// Initialize skills collection with some initial data
async function initializeSkills() {
  const skillList = [
    { name: "JavaScript", proficiency: "Expert" },
    { name: "HTML & CSS", proficiency: "Advanced" }
  ];
  await Skill.insertMany(skillList);  // Insert the sample skills into the collection
}

// Add a new skill to the collection
async function addSkill(skillName, skillProficiency) {
  await db.connect();
  let newSkill = new Skill({
    name: skillName,
    proficiency: skillProficiency
  });
  
  let result = await newSkill.save();  // Save the new skill to the DB
  console.log(result);
}

// Update an existing skill's proficiency level
async function updateSkillProficiency(skillName, newProficiency) {
  await db.connect();
  let result = await Skill.updateOne(
    { name: skillName },
    { proficiency: newProficiency }
  );
  // Check if the update was successful by inspecting result.modifiedCount
  console.log(result);
}

// Delete a skill by name
async function deleteSkillByName(skillName) {
  await db.connect();
  let result = await Skill.deleteOne({ name: skillName });
  console.log(result);
}

module.exports = {
  getSkills,
  initializeSkills,
  addSkill,
  updateSkillProficiency,
  deleteSkillByName
};
