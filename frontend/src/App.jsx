import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please select a resume (PDF) first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResult(response.data);
      if (response.data.score > 70) {
        triggerConfetti();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to analyze resume. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#ec4899', '#f8fafc']
    });
  };

  return (
    <div style={{ padding: '3rem 1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }} className="animate-fade-in">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          AI <span className="gradient-text">Resume Analyzer</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Evaluate your resume instantly using advanced AI algorithms. Discover your strengths, weaknesses, and tailored tips to land your dream job.
        </p>
      </header>

      {!result ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div 
            style={{ 
              border: '2px dashed rgba(255,255,255,0.2)', 
              borderRadius: '16px', 
              padding: '3rem 2rem', 
              cursor: 'pointer',
              marginBottom: '2rem',
              backgroundColor: 'rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              type="file" 
              id="file-upload" 
              accept=".pdf" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <Upload size={48} color="var(--primary)" style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {file ? file.name : "Drag & Drop your resume here"}
            </h3>
            <p style={{ color: 'var(--text-muted)' }}>
              or click to browse from your device (PDF only)
            </p>
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <button 
              className="glass-button" 
              onClick={analyzeResume} 
              disabled={loading || !file}
              style={{ width: '100%', maxWidth: '300px' }}
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Analyzing...</>
              ) : (
                <><Sparkles size={20} /> Analyze AI Resume</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }} className="gradient-text">Analysis Overview</h2>
              <p style={{ color: 'var(--text-muted)' }}><FileText size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} /> {file?.name}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                background: `conic-gradient(var(--primary) ${result.score}%, transparent 0)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                margin: '0 auto'
              }}>
                <div style={{ 
                  background: 'var(--bg-dark)', 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: '700'
                }}>
                  {result.score}
                </div>
              </div>
              <p style={{ marginTop: '0.5rem', fontWeight: '600' }}>Overall Score</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', marginBottom: '1rem' }}>
                <CheckCircle size={20} /> Strengths
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {result.strengths.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--success)' }}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginBottom: '1rem' }}>
                <AlertCircle size={20} /> Weaknesses
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {result.weaknesses.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--danger)' }}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '2.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', marginBottom: '1rem' }}>
              <Lightbulb size={20} /> Actionable Tips
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.tips.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--warning)' }}>→</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="glass-button" onClick={() => { setResult(null); setFile(null); }}>
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
