const Resume = require("../models/resume");
const Analysis = require("../models/analysis");
const { analyzeResumeWithGemini } = require("../utils/geminiAnalyzer");

exports.runAnalysis = async (req, res) => {
  const pending = req.session.pendingAnalysis;

  if (!pending) {
    return res.redirect("/resume/upload");
  }

  delete req.session.pendingAnalysis;
  req.session.save((saveErr) => {
    if (saveErr) {
      console.error("Session save error:", saveErr);
    }
  });

  try {
    const resume = await Resume.findById(pending.resumeId);
    if (!resume || resume.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/resume/upload");
    }

    const aiResult = await analyzeResumeWithGemini(
      resume.extractedText,
      pending.jobDescription
    );

    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      jobTitle: pending.jobTitle,
      jobDescription: pending.jobDescription,
      atsScore: aiResult.atsScore,
      skillMatch: aiResult.skillMatch,
      matchingSkills: aiResult.matchingSkills || [],
      missingSkills: aiResult.missingSkills || [],
      strengths: aiResult.strengths || [],
      weaknesses: aiResult.weaknesses || [],
      suggestions: aiResult.suggestions || [],
    });

    res.render("result", {
      analysis: analysis,
      resume: resume,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.render("upload", {
      error: "AI analysis failed: " + (err.message || "Please try again."),
    });
  }
};

exports.getAnalysis = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid analysis ID.");
    }
    
    const analysis = await Analysis.findById(req.params.id)
      .populate("resumeId");

    if (!analysis || analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(404).send("Analysis not found.");
    }

    res.render("result", {
      analysis: analysis,
      resume: analysis.resumeId,
    });
  } catch (err) {
    console.error("Get analysis error:", err);
    res.status(500).send("Error loading analysis.");
  }
};

exports.getHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .populate("resumeId", "originalFileName")
      .sort({ createdAt: -1 });

    res.render("history", { analyses: analyses });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).send("Error loading history.");
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const recentAnalyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const allAnalyses = await Analysis.find({ userId: req.user._id });
    const avgScore =
      allAnalyses.length > 0
        ? Math.round(
          allAnalyses.reduce((sum, a) => sum + a.atsScore, 0) /
              allAnalyses.length
        )
        : 0;

    res.render("dashboard", {
      recentAnalyses: recentAnalyses,
      totalAnalyses: allAnalyses.length,
      avgScore: avgScore,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Error loading dashboard.");
  }
};

exports.deleteAnalysis = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid analysis ID." });
    }
    
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis || analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Delete failed." });
  }
};
