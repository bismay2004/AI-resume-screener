const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/dashboard", isLoggedIn, analysisController.getDashboard);

router.get("/run", isLoggedIn, analysisController.runAnalysis);

router.get("/", isLoggedIn, analysisController.getHistory);

router.get("/:id", isLoggedIn, analysisController.getAnalysis);

router.delete("/:id", isLoggedIn, analysisController.deleteAnalysis);

module.exports = router;
