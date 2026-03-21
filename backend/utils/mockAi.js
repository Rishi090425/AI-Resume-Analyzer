const analyzeResume = async (text) => {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const score = Math.floor(Math.random() * 40) + 55; // Random score 55-95
  
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

module.exports = { analyzeResume };
