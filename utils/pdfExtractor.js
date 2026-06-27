const pdfParse = require("pdf-parse");
const fs = require("fs");

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  const cleanedText = data.text
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanedText || cleanedText.length < 50) {
    throw new Error(
      "Could not extract meaningful text from PDF. Make sure it is not a scanned image."
    );
  }

  return cleanedText;
}

module.exports = { extractTextFromPDF };
