const multer = require('multer');
const pdfParse = require('pdf-parse');

// Inline mock AI analyzer (avoids relative path issues in serverless env)
const analyzeResume = async (text) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const score = Math.floor(Math.random() * 40) + 55; // 55-95
  return {
    score,
    strengths: [
      "Good overall structure and readability.",
      "Adequate use of action verbs.",
      "Clear contact information."
    ],
    weaknesses: [
      "Lacks strongly quantified achievements.",
      "Some technical skills are not elaborated enough."
    ],
    tips: [
      "Add robust metrics to your experience bullet points.",
      "Include a dedicated section for standout projects.",
      "Tailor your resume more specifically to the target job description."
    ]
  };
};

// Configure multer to store uploaded file in memory
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Vercel Serverless Function — handles POST /api/analyze
 */
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use multer as middleware inside a Promise
  return new Promise((resolve) => {
    upload.single('resume')(req, res, async (err) => {
      if (err) {
        res.status(400).json({ error: 'File upload error: ' + err.message });
        return resolve();
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded. Please send a PDF as "resume" field.' });
        return resolve();
      }

      try {
        let text = "";
        try {
          const data = await pdfParse(req.file.buffer);
          text = data.text;
        } catch (parseErr) {
          console.warn("PDF parsing failed, using fallback:", parseErr.message);
          text = "Fallback content due to parse error: " + req.file.originalname;
        }

        const analysis = await analyzeResume(text);
        res.status(200).json(analysis);
        resolve();
      } catch (error) {
        console.error("Error analyzing resume:", error);
        res.status(500).json({ error: 'Failed to analyze resume' });
        resolve();
      }
    });
  });
};
