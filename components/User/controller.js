const userModel = require("./model");

const getUser = async (request, response) => {
  console.log(request.session);
  if (request.session.loggedIn) {
    response.render("user/user", { username: request.session.user });
  } else {
    response.redirect("/user/login");
  }
};

const loginForm = (request, response) => {
  response.render("user/login");
};

const login = async (request, response) => {
  const { u, pw } = request.body;

  // Updated: get back both isAuthenticated and isAdmin
  let auth = await userModel.authenticateUser(u, pw);
  console.log("Auth result:", auth);

  if (auth && auth.isAuthenticated) {
    request.session.loggedIn = true;
    request.session.user = u;
    request.session.isAdmin = auth.isAdmin;  // ✅ Store admin status in session
    response.redirect("/user");
  } else {
    response.render("user/login", { err: "User not found" });
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
