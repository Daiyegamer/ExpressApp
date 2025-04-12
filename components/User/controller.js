const userModel = require("./model");

const getUser = async (req, res) => {
  if (req.session.loggedIn) {
    // React frontend calls: return JSON
    if (req.headers.accept?.includes("application/json")) {
      return res.json({
        loggedIn: true,
        username: req.session.user,
        isAdmin: req.session.isAdmin ?? false,
      });
    }

    // Express Pug views: render user page
    return res.render("user/user", { username: req.session.user });
  }

  // Not logged in
  if (req.headers.accept?.includes("application/json")) {
    return res.status(401).json({ loggedIn: false });
  }

  // Not logged in, using browser — redirect to login page
  return res.redirect("/user/login");
};


const loginForm = (request, response) => {
  response.render("user/login");
};

const login = async (req, res) => {
  const { u, pw } = req.body;

  const auth = await userModel.authenticateUser(u, pw);
  console.log("Auth result:", auth);

  if (auth && auth.isAuthenticated) {
    req.session.loggedIn = true;
    req.session.user = u;
    req.session.isAdmin = auth.isAdmin;

    // ✅ If React is calling this (fetch/axios)
    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, isAdmin: auth.isAdmin });
    }

    // ✅ If browser form (Pug login page)
    return res.redirect("/user");
  } else {
    // ❌ Failed login
    if (req.headers.accept?.includes("application/json")) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    return res.render("user/login", { err: "Invalid username or password" });
  }
};


const logout = (request, response) => {
  request.session.destroy(() => {
    response.redirect("/");
  });
};

const registerForm = (request, response) => {
  response.render("user/register");
};

const register = async (request, response) => {
  let result = await userModel.addUser(request.body.u, request.body.pw);
  console.log(`result: ${result}`);
  if (result) {
    response.redirect("/user/login");
  } else {
    response.render("user/register", { err: "Username already exists" });
  }
};

module.exports = {
  getUser,
  loginForm,
  login,
  logout,
  registerForm,
  register
};
