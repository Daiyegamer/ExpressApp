const express = require("express");
const path = require("path");
const sessions = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // Load .env variables

const app = express(); // ✅ Must be BEFORE app.use

// ✅ Enable CORS for your React frontend
app.use(cors({
  origin: true, // allows ALL origins
  credentials: true, // allows cookies/auth headers
}));
// MongoDB connection
const { connect } = require("./db");
connect().then(() => {
  console.log("MongoDB connected successfully");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const port = process.env.PORT || "8888";

// Set view engine to Pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(sessions({
  secret: process.env.SESSIONSECRET,
  name: "MyUniqueSessID",
  saveUninitialized: false,
  resave: false,
  cookie: {
    sameSite: "none", // ✅ Allow cross-origin cookies
    secure: true      // ✅ Cookies only over HTTPS (Render uses HTTPS)
  }
}));


// ✅ Make session available in Pug views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// 🔧 Routes setup
app.use("/admin/skills", require("./components/Skill/routes"));
app.use("/admin/projects", require("./components/Project/routes"));
app.use("/skills", require("./components/Skill/routes"));
app.use("/projects", require("./components/Project/routes"));
app.use("/user", require("./components/User/routes"));

// 🌐 Home page
app.get("/", async (request, response) => {
  const skillList = await require("./components/Skill/model").getSkills();
  const projectList = await require("./components/Project/model").getProjects();
  response.render("index", { skills: skillList, projects: projectList });
});

// 📡 API endpoints
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await require("./components/Skill/model").getSkills();
    res.json(skills);
  } catch {
    res.status(500).json({ message: "Error fetching skills" });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await require("./components/Project/model").getProjects();
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// 🚀 Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
