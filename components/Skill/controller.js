const skillModel = require("./model");

const getAllSkills = async (req, res) => {
  const skills = await skillModel.getSkills();
  res.render("admin/skills", { skills });
};

const addSkill = async (req, res) => {
  try {

    console.log("BODY:", req.body); 
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: "Missing name or level" });
    }

    await skillModel.addSkill(name, level);

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true });
    }

    res.redirect("/admin/skills");
  } catch (err) {
    console.error("Add Skill Error:", err);
    res.status(500).json({ message: "Error adding skill" });
  }
};

const deleteSkill = async (req, res) => {
  const name = req.params.name;
  console.log("🔴 Skill delete triggered for", name);
  console.log("✅ DELETE route hit:", req.params.name);

  try {
    await skillModel.deleteSkillByName(name);

    // ✅ If React (expects JSON)
    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true });
    }

    // ✅ If browser/Pug view (redirect back)
    res.redirect("/admin/skills");
  } catch (err) {
    console.error("❌ Delete skill error:", err);

    if (req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ success: false, message: "Error deleting skill" });
    }

    res.redirect("/admin/skills");
  }
};


const getSkillsAPI = async (req, res) => {
  const skills = await skillModel.getSkills();
  res.json(skills);
};

module.exports = {
  getAllSkills,
  addSkill,
  deleteSkill,
  getSkillsAPI
};
