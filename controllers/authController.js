const passport = require("passport");
const User = require("../models/user");

exports.getSignup = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/analysis/dashboard");
  res.render("signup", { error: null });
};

exports.postSignup = async (req, res) => {
  let { name, email, password, confirmPassword } = req.body;
  
  name = name ? name.trim() : "";
  email = email ? email.trim().toLowerCase() : "";

  if (!name || !email || !password) {
    return res.render("signup", { error: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.render("signup", { error: "Passwords do not match." });
  }

  if (password.length < 6) {
    return res.render("signup", {
      error: "Password must be at least 6 characters.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        error: "An account with this email already exists.",
      });
    }

    const newUser = await User.create({ name, email, password });

    req.login(newUser, (err) => {
      if (err) return res.render("signup", { error: "Login failed after signup." });
      res.redirect("/analysis/dashboard");
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.render("signup", { error: "Something went wrong. Please try again." });
  }
};

exports.getLogin = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/analysis/dashboard");
  res.render("login", { error: null });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.render("login", { error: info.message });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/analysis/dashboard");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
