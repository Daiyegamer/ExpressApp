const skillModel = require("./model");

// Get all skills and render the admin page for skills
const getAllSkills = async (request, response) => {
  let skillList = await skillModel.getSkills();

  if (!skillList.length) {
    await skillModel.initializeSkills();
    skillList = await skillModel.getSkills();
  }

  response.render("admin/skills", { skills: skillList });
};

// Add a new skill
const addSkill = async (request, response) => {
  const { name, proficiency } = request.body;
  await skillModel.addSkill(name, proficiency);
  response.redirect("/admin/skills");
};

// Delete a skill by name (using GET for delete link)
const deleteSkill = async (request, response) => {
  const skillName = request.params.name;  // Get the skill name from the URL
  await skillModel.deleteSkillByName(skillName);  // Delete skill by name
  response.redirect("/admin/skills");  // Redirect back to the skills admin page
};

const getSkillsAPI = async (request, response) => {
  let skillList = await skillModel.getSkills();  // Fetch skills from the model
  response.json(skillList);  // Return the skills as JSON
};

module.exports = {
  getAllSkills,
  addSkill,
  deleteSkill,
  getSkillsAPI
  
};
