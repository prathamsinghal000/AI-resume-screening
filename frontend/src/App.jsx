import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [jdText, setJdText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jdText.trim()) {
      setError('Please upload a PDF and paste a job description to continue.');
      return;
    }
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jd_text', jdText);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData);
      setResults(response.data);
    } catch {
      setError('Unable to connect to the analysis server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">SkillMatch</h1>
            <p className="app-subtitle">AI-Powered Resume & Job Description Analyzer</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Input Section */}
        <section className="input-section">
          <div className="section-card">
            <h2 className="section-title">
              <span className="icon">📋</span> Upload & Analyze
            </h2>
            
            <div className="form-group">
              <label className="form-label">Resume (PDF)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="pdf-input"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="file-input"
                />
                <label htmlFor="pdf-input" className="file-label">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{fileName}</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea
                className="textarea-input"
                placeholder="Paste the complete job description here. Include title, responsibilities, requirements, and desired qualifications..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows="6"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="analyze-button"
            >
              <span className="button-icon">{loading ? '⏳' : '✨'}</span>
              {loading ? 'Analyzing...' : 'Run AI Analysis'}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {results && (
          <section className="results-section">
            <div className="section-card results-card">
              <h2 className="section-title">
                <span className="icon">📊</span> Analysis Report
              </h2>

              {/* Score Cards */}
              <div className="scores-container">
                <div className="score-card baseline">
                  <div className="score-label">Standard Score</div>
                  <div className="score-value">{(results.baseline_score * 100).toFixed(1)}</div>
                  <div className="score-unit">%</div>
                  <div className="score-description">Baseline matching</div>
                </div>

                <div className="score-divider"></div>

                <div className="score-card improved">
                  <div className="score-label">Improved Score</div>
                  <div className="score-value">{(results.expanded_score * 100).toFixed(1)}</div>
                  <div className="score-unit">%</div>
                  <div className="score-description">Enhanced matching</div>
                </div>
              </div>

              {/* Improvement Indicator */}
              {results.improvement_percentage > 0 && (
                <div className="improvement-banner">
                  <span className="improvement-icon">📈</span>
                  <span className="improvement-text">
                    <strong>+{results.improvement_percentage}% improvement</strong> with semantic matching
                  </span>
                </div>
              )}

              {/* Interpretation Section */}
              <div className="interpretation-box">
                <h3 className="interpretation-title">💡 How to Read Your Results</h3>
                <p className="interpretation-text">
                  {results.improvement_percentage > 0
                    ? `Our NLP engine found specific skills in your resume (like "${results.detected_skills[0]}") and successfully mapped them to broader job requirements, improving your match by ${results.improvement_percentage}%.`
                    : 'Our system found your resume already closely matches the job description keywords, or contains skills not yet in our skill database.'}
                </p>
              </div>

              {/* Skills & Terms */}
              <div className="skills-section">
                <div className="skill-group">
                  <h4 className="skill-title">🎯 Detected Skills</h4>
                  <div className="skill-tags">
                    {results.detected_skills && results.detected_skills.length > 0 ? (
                      results.detected_skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag detected-skill">{skill}</span>
                      ))
                    ) : (
                      <span className="no-skills">No skills detected</span>
                    )}
                  </div>
                </div>

                <div className="skill-group">
                  <h4 className="skill-title">🌐 Semantic Concepts</h4>
                  <div className="skill-tags">
                    {results.expanded_terms && results.expanded_terms.length > 0 ? (
                      results.expanded_terms.map((term, idx) => (
                        <span key={idx} className="skill-tag semantic-term">{term}</span>
                      ))
                    ) : (
                      <span className="no-skills">No semantic terms found</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>SkillMatch © 2026 | AI Resume Screening Analysis</p>
      </footer>
    </div>
  );
}

export default App;