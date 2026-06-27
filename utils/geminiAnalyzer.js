const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResumeWithGemini(resumeText, jobDescription) {
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `
You are an expert ATS (Applicant Tracking System) and senior technical recruiter.

Analyze the following resume against the provided job description and return a detailed evaluation.

IMPORTANT: Return ONLY a valid JSON object. No markdown, no explanation, no backticks. Just raw JSON.

Resume Text:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return this exact JSON structure:
{
  "atsScore": <number 0-100, overall ATS compatibility score>,
  "skillMatch": <number 0-100, percentage of required skills found in resume>,
  "matchingSkills": [<array of skill strings found in both resume and JD>],
  "missingSkills": [<array of skills required by JD but missing from resume>],
  "strengths": [<array of 3-5 strong points about this resume for this role>],
  "weaknesses": [<array of 3-5 weak areas or gaps>],
  "suggestions": [<array of 4-6 specific actionable improvements>]
}

Scoring guidelines:
- atsScore above 80: Strong candidate
- atsScore 60-80: Good candidate with some gaps
- atsScore below 60: Needs significant improvement
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  if (!text || typeof text !== "string") {
    throw new Error("Empty response from AI");
  }

  const cleanText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleanText);

    if (
      typeof parsed.atsScore !== "number" ||
      typeof parsed.skillMatch !== "number"
    ) {
      throw new Error("Invalid response structure from AI");
    }

    parsed.atsScore = Math.min(100, Math.max(0, parsed.atsScore));
    parsed.skillMatch = Math.min(100, Math.max(0, parsed.skillMatch));

    return parsed;
  } catch (parseErr) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error(
      "AI returned an unexpected format. Please try again."
    );
  }
}

module.exports = { analyzeResumeWithGemini };
