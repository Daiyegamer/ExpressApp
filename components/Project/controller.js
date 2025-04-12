const projectModel = require("./model");

// Render admin page with all projects
const getAllProjects = async (req, res) => {
  let projectList = await projectModel.getProjects();

  if (!projectList.length) {
    await projectModel.initializeProjects();
    projectList = await projectModel.getProjects();
  }

  res.render("admin/projects", { projects: projectList });
};

// Add new project (supports both React and Pug)
const addProject = async (req, res) => {
  try {
    const { name, description, url } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Missing name or description" });
    }

    await projectModel.addProject(name, description, url);

    if (req.headers.accept.includes("application/json")) {
      return res.json({ success: true });
    }

    res.redirect("/admin/projects");
  } catch (err) {
    console.error("Add Project Error:", err);
    res.status(500).json({ message: "Error adding project" });
  }
};

// Delete project by name
const deleteProject = async (req, res) => {
  const projectName = req.params.name;
  await projectModel.deleteProjectByName(projectName);
  res.redirect("/admin/projects");
};

// API: return all projects as JSON
const getProjectsAPI = async (req, res) => {
  const projectList = await projectModel.getProjects();
  res.json(projectList);
};

module.exports = {
  getAllProjects,
  addProject,
  deleteProject,
  getProjectsAPI,
};
