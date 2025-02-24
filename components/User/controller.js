const userModel = require("./model");

const getUser = async (request, response) => {
  console.log(request.session);
  //get user from session and render user page
  if (request.session.loggedIn) {
    //let user = await userModel.getUser(request.session.user);
    response.render("user/user", { username: request.session.user });
  } else {
    //if session variable doesn't exist redirect to /user/login
    response.redirect("/user/login");
  }
}
const loginForm = (request, response) => {
  response.render("user/login");
}
const login = async (request, response) => {
  //authenticate user and redirect to /user
  let auth = await userModel.authenticateUser(request.body.u, request.body.pw);
  console.log(auth);
  if (auth) {
    //if authenticated, set session variables
    request.session.loggedIn = true;
    request.session.user = request.body.u;
    //now redirect to /user
    response.redirect("/user");
  } else {
    response.render("user/login", { err: "User not found" });
  }
}
const logout = (request, response) => {
  //destroy session and redirect to home
  request.session.destroy();
  response.redirect("/");
}
const registerForm = (request, response) => {
  response.render("user/register");
}
const register = async (request, response) => {
  //get values from form and create new user
  let result = await userModel.addUser(request.body.u, request.body.pw);
  console.log(`result: ${result}`);
  if (result) {
    response.redirect("/user/login");
  } else {
    response.render("user/register", { err: "Username already exists"});
  }
}

module.exports = {
  getUser,
  loginForm,
  login,
  logout,
  registerForm,
  register
}