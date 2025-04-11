const express = require("express");
const path = require("path");
const sessions = require("express-session");
const dotenv = require("dotenv"); 


// Load environment variables from .env file
dotenv.config();


// Set up the Express app

// Import the connect function to establish a MongoDB connection
const { connect } = require("./db");

// Connect to MongoDB
connect().then(() => {
  console.log("MongoDB connected successfully");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});


const app = express();
const port = process.env.PORT || "8888";


// Set view engine to Pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// Session management
app.use(
  sessions({
    secret: process.env.SESSIONSECRET,
    name: "MyUniqueSessID",
    saveUninitialized: false,
    resave: false,
  })
);
// Make session available in all Pug templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


// Routes setup for managing skills and projects (admin pages)
app.use("/admin/skills", require("./components/Skill/routes"));
app.use("/admin/projects", require("./components/Project/routes"));

// Routes setup for general use (skills, projects, user routes)
app.use("/skills", require("./components/Skill/routes"));
app.use("/projects", require("./components/Project/routes"));
app.use("/user", require("./components/User/routes"));  // If you have user routes
// Use routes for skills and projects



// Define the root route to render the index.pug page with both skills and projects
app.get("/", async (request, response) => {
  // Fetch skills and projects data from the database
  const skillList = await require("./components/Skill/model").getSkills();
  const projectList = await require("./components/Project/model").getProjects();

  // Render the 'index.pug' view with both skills and projects data
  response.render("index", { skills: skillList, projects: projectList });
});

app.get("/api/skills", async (req, res) => {
  try {
    const skillList = await require("./components/Skill/model").getSkills(); // Fetch skills from the database
    res.json(skillList);  // Return skills as JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching skills" });
  }
});

// **API Endpoint for Projects** - Fetch all projects as JSON
// Modified path to /api/list for consistency with your controller
app.get("/api/projects", async (req, res) => {
  try {
    const projectList = await require("./components/Project/model").getProjects(); // Fetch projects from the database
    res.json(projectList);  // Return projects as JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
