const path = require("path");
const fs = require("fs");
const Resume = require("../models/resume");
const { extractTextFromPDF } = require("../utils/pdfExtractor");

exports.getUpload = (req, res) => {
  res.render("upload", { error: null });
};

exports.postUpload = async (req, res) => {
  if (!req.file) {
    return res.render("upload", {
      error: "Please upload a valid PDF file (max 5MB).",
    });
  }

  const { jobTitle, jobDescription } = req.body;

  const trimmedTitle = jobTitle ? jobTitle.trim() : "";
  const trimmedDesc = jobDescription ? jobDescription.trim() : "";

  if (!trimmedTitle || !trimmedDesc || trimmedDesc.length < 20) {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("File cleanup error:", cleanupErr);
      }
    }
    return res.render("upload", {
      error: "Job title is required and job description must be at least 20 characters.",
    });
  }

  try {
    const extractedText = await extractTextFromPDF(req.file.path);

    const resume = await Resume.create({
      userId: req.user._id,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      extractedText: extractedText,
    });

    req.session.pendingAnalysis = {
      resumeId: resume._id.toString(),
      jobTitle: trimmedTitle,
      jobDescription: trimmedDesc,
    };

    res.redirect("/analysis/run");
  } catch (err) {
    console.error("Upload error:", err);
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("File cleanup error:", cleanupErr);
      }
    }
    res.render("upload", {
      error: err.message || "Failed to process PDF. Please try again.",
    });
  }
};
