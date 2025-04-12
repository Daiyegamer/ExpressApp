const userModel = require("./model");

const getUser = async (request, response) => {
  if (request.session.loggedIn) {
    response.json({
      loggedIn: true,
      username: request.session.user,
      isAdmin: request.session.isAdmin || false,
    });
  } else {
    response.status(401).json({ loggedIn: false });
  }
};

const loginForm = (request, response) => {
  response.render("user/login");
};

const login = async (request, response) => {
  const { u, pw } = request.body;

  // authenticateUser returns { isAuthenticated, isAdmin }
  let auth = await userModel.authenticateUser(u, pw);
  console.log("Auth result:", auth);

  if (auth && auth.isAuthenticated) {
    request.session.loggedIn = true;
    request.session.user = u;
    request.session.isAdmin = auth.isAdmin;

    // ✅ Send back JSON for React
    response.json({ success: true, isAdmin: auth.isAdmin });
  } else {
    // ✅ Send back failure message
    response.status(401).json({ success: false, message: "Invalid credentials" });
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
