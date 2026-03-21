const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { analyzeResume } = require('../utils/mockAi');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = "";
    try {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } catch (parseErr) {
      console.warn("PDF parsing failed, using fallback text for AI analysis.", parseErr);
      text = "Fallback resume content due to parsing error. " + req.file.originalname;
    }

    // Analyze using mock AI
    const analysis = await analyzeResume(text);

    // In a real application, we would save to MongoDB here.
    // e.g., const analysisRecord = new Analysis({ resumeText: text, ...analysis }); await analysisRecord.save();

    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

module.exports = router;
