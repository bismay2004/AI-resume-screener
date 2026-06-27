const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const isLoggedIn = require("../middleware/isLoggedIn");
const upload = require("../middleware/upload");

router.get("/upload", isLoggedIn, resumeController.getUpload);

router.post(
  "/upload",
  isLoggedIn,
  (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
      if (err) {
        return res.render("upload", { error: err.message });
      }
      next();
    });
  },
  resumeController.postUpload
);

module.exports = router;
