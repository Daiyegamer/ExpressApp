const projectModel = require("./model");

// Get all projects and render the admin page for projects
const getAllProjects = async (request, response) => {
  let projectList = await projectModel.getProjects();

  if (!projectList.length) {
    await projectModel.initializeProjects();
    projectList = await projectModel.getProjects();
  }

  response.render("admin/projects", { projects: projectList });
};

// Add a new project
const addProject = async (request, response) => {
  const { name, description, url } = request.body;
  await projectModel.addProject(name, description, url);
  response.redirect("/admin/projects");
};

// Delete a project by name (instead of ID)
const deleteProject = async (request, response) => {
  const projectName = request.params.name;  // Get the project name from the URL
  await projectModel.deleteProjectByName(projectName);  // Delete project by name
  response.redirect("/admin/projects");
};
const getProjectsAPI = async (request, response) => {
  let skillList = await skillModel.getProjects();  // Fetch skills from the model
  response.json(skillList);  // Return the skills as JSON
};

module.exports = {
  getAllProjects,
  addProject,
  deleteProject,
  getProjectsAPI
  
};
