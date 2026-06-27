require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const path = require("path");

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
const analysisRoutes = require("./routes/analysis");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
      domain: undefined,
    },
  })
);

require("./middleware/passportConfig")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/analysis/dashboard");
  }
  res.render("home");
});

app.use("/", authRoutes);
app.use("/resume", resumeRoutes);
app.use("/analysis", analysisRoutes);

app.use((req, res) => {
  res.status(404).render("404");
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("<h2>Something broke!</h2><p>Please try again later.</p>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
