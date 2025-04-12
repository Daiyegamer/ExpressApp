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


const addSkill = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: "Missing name or level" });
    }

    await skillModel.addSkill(name, level);

    // Check if it's a React request
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.json({ success: true });
    } else {
      res.redirect("/admin/skills");
    }
  } catch (err) {
    console.error("Add Skill Error:", err);
    res.status(500).json({ message: "Error adding skill" });
  }
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
