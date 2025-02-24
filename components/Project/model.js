const mongoose = require("mongoose");
const db = require("../../db"); // Shared db connection

// Set up schema and model for projects
const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  url: String
});

const Project = mongoose.model("Project", ProjectSchema);

// MongoDB Functions

// Get all projects from the projects collection
async function getProjects() {
  await db.connect();  // Establish the DB connection
  return await Project.find({});  // Fetch and return all projects as an array
}

// Initialize projects collection with some initial data
async function initializeProjects() {
  const projectList = [
    { name: "Portfolio Website", description: "My personal portfolio showcasing my work.", url: "https://example.com" },
    { name: "E-commerce App", description: "A full-stack e-commerce app built with React and Node.js.", url: "https://example.com" }
  ];
  await Project.insertMany(projectList);  // Insert the sample projects into the collection
}

// Add a new project to the collection
async function addProject(projectName, projectDescription, projectUrl) {
  await db.connect();
  let newProject = new Project({
    name: projectName,
    description: projectDescription,
    url: projectUrl
  });
  
  let result = await newProject.save();  // Save the new project to the DB
  console.log(result);
}

// Update an existing project's information
async function updateProject(projectName, newDescription, newUrl) {
  await db.connect();
  let result = await Project.updateOne(
    { name: projectName },
    { description: newDescription, url: newUrl }
  );
  // Check if the update was successful by inspecting result.modifiedCount
  console.log(result);
}

// Delete a project by name
async function deleteProjectByName(projectName) {
  await db.connect();
  let result = await Project.deleteOne({ name: projectName });
  console.log(result);
}

module.exports = {
  getProjects,
  initializeProjects,
  addProject,
  updateProject,
  deleteProjectByName // Ensure you export the correct delete function
};

