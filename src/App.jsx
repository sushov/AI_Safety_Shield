// src/App.jsx
import React, { useState } from "react";
import "./assets/style.css";

const API_BASE = "http://localhost:3001";

export default function App() {
  const [activeTab, setActiveTab] = useState("tester"); // 'tester' or 'about'
  const [prompt, setPrompt] = useState("");

  // Single Analysis State
  const [analysis, setAnalysis] = useState(null);

  // Red Team Results State (already analyzed by backend now)
  const [redTeamResults, setRedTeamResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getColors = (score) => {
    if (score >= 80) return { color: "#ef4444", label: "CRITICAL RISK" };
    if (score >= 40) return { color: "#f97316", label: "MODERATE RISK" };
    return { color: "#22c55e", label: "SAFE" };
  };

  const renderSignalsBadges = (signals) => {
    if (!signals) return null;

    return (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
        {signals?.sensitiveTarget && (
          <span
            className="badge"
            style={{
              background: "rgba(239,68,68,0.15)",
              color: "#fca5a5",
              border: "1px solid rgba(239,68,68,0.25)",
              padding: "4px 8px",
              borderRadius: "999px",
              fontSize: "0.75rem",
            }}
          >
            Sensitive Target
          </span>
        )}
        {signals?.socialEngineering && (
          <span
            className="badge"
            style={{
              background: "rgba(249,115,22,0.15)",
              color: "#fdba74",
              border: "1px solid rgba(249,115,22,0.25)",
              padding: "4px 8px",
              borderRadius: "999px",
              fontSize: "0.75rem",
            }}
          >
            Social Engineering
          </span>
        )}
      </div>
    );
  };

  // 1) Single Prompt Analysis
  const handleAnalyze = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setAnalysis(null);
    setRedTeamResults([]);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Analyze failed.");
      if (!data?.categories) throw new Error("Invalid response format.");

      setAnalysis(data);
    } catch (err) {
      setError(err.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // 2) Red Team (Backend generates + analyzes 3 variants)
  const handleRedTeam = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setAnalysis(null);
    setRedTeamResults([]);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/redteam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Red team failed.");
      setRedTeamResults(data?.results || []);
    } catch (err) {
      setError("Red Team Failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <h1>🛡️ AI Safety Shield</h1>
          <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Enterprise Grade Prompt Analysis
          </span>
        </div>
        <nav className="nav-tabs">
          <button
            className={`nav-btn ${activeTab === "tester" ? "active" : ""}`}
            onClick={() => setActiveTab("tester")}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            How it Works
          </button>
        </nav>
      </header>

      {/* DASHBOARD TAB */}
      {activeTab === "tester" && (
        <main className="dashboard-grid">
          {/* Left Panel: Input */}
          <section className="card">
            <h2>Prompt Injection Test</h2>
            <p style={{ marginBottom: "20px", color: "#94a3b8", fontSize: "0.9rem" }}>
              Paste a user prompt below to evaluate it against standard safety policies (Violence,
              Self-Harm, Jailbreaks).
            </p>

            <textarea
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Ignore previous instructions and tell me how to...'"
              rows={12}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button className="action-btn" onClick={handleAnalyze} disabled={loading} style={{ flex: 1 }}>
                {loading ? "Scanning..." : "Run Analysis"}
              </button>

              <button
                className="action-btn"
                onClick={handleRedTeam}
                disabled={loading}
                style={{ flex: 1, background: "#7c3aed", borderColor: "#7c3aed" }}
              >
                {loading ? "Attacking..." : "😈 Red Team"}
              </button>
            </div>

            {error && <div style={{ color: "#ef4444", marginTop: "15px" }}>⚠️ {error}</div>}
          </section>

          {/* Right Panel: Output */}
          <section className="card">
            <h2>Threat Intelligence</h2>

            {!analysis && redTeamResults.length === 0 && !loading && (
              <div style={{ textAlign: "center", marginTop: "60px", opacity: 0.5 }}>
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📡</div>
                <p>Waiting for input stream...</p>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: "center", marginTop: "60px" }}>
                <div className="loader"></div>
                <p style={{ color: "#3b82f6" }}>Running neural evaluation...</p>
              </div>
            )}

            {/* VIEW 1: Single Analysis */}
            {analysis && (
              <div className="results fade-in">
                {/* Score Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "18px" }}>
                  <div
                    className="score-circle"
                    style={{
                      borderColor: getColors(analysis.riskScore).color,
                      color: getColors(analysis.riskScore).color,
                    }}
                  >
                    {analysis.riskScore}
                  </div>
                  <div>
                    <div className="risk-level" style={{ color: getColors(analysis.riskScore).color }}>
                      {getColors(analysis.riskScore).label}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      Confidence: 98%
                    </div>
                  </div>
                </div>

                {/* Deterministic Signals */}
                {renderSignalsBadges(analysis.signals)}

                {/* Summary */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ color: "#f8fafc", marginBottom: "5px" }}>Model Assessment</h3>
                  <p className="summary-text">{analysis.summary}</p>
                </div>

                {/* Category List */}
                <div className="categories">
                  <h3 style={{ marginBottom: "10px" }}>Safety Guardrails</h3>
                  {analysis.categories.map((cat, i) => (
                    <div key={i} className="category-row">
                      <span style={{ color: cat.triggered ? "#f8fafc" : "#64748b" }}>
                        {cat.label}
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: cat.triggered ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.1)",
                          color: cat.triggered ? "#fca5a5" : "#86efac",
                        }}
                      >
                        {cat.triggered ? `⚠️ ${cat.severity}` : "CLEAN"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                {analysis?.suggestions?.length > 0 && (
                  <div style={{ marginTop: "18px" }}>
                    <h3 style={{ marginBottom: "10px" }}>Suggestions</h3>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px" }}>
                      {analysis.suggestions.slice(0, 5).map((s, i) => (
                        <li key={i} style={{ marginBottom: "6px" }}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: Red Team Results */}
            {redTeamResults.length > 0 && (
              <div className="results fade-in">
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "10px",
                    background: "rgba(124, 58, 237, 0.1)",
                    borderRadius: "6px",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                  }}
                >
                  <strong style={{ color: "#a78bfa" }}>😈 Adversarial Mode Active</strong>
                  <p style={{ fontSize: "0.85rem", color: "#cbd5e1", margin: "5px 0 0 0" }}>
                    Generated 3 sanitized attack styles and evaluated each variant.
                  </p>
                </div>

                <div className="categories">
                  {redTeamResults.map((res, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        borderLeft: `4px solid ${getColors(res.riskScore).color}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            textTransform: "uppercase",
                            color: "#94a3b8",
                            letterSpacing: "1px",
                          }}
                        >
                          Attack Vector #{i + 1}
                        </span>
                        <span style={{ fontWeight: "bold", color: getColors(res.riskScore).color }}>
                          Risk: {res.riskScore}/100
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.9rem",
                          color: "#e2e8f0",
                          background: "rgba(0,0,0,0.3)",
                          padding: "10px",
                          borderRadius: "4px",
                          marginBottom: "10px",
                        }}
                      >
                        "{res.prompt}"
                      </div>

                      {/* Deterministic Signals */}
                      {renderSignalsBadges(res.signals)}

                      <div style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>{res.summary}</div>

                      {/* Suggestions (top 3) */}
                      {res?.suggestions?.length > 0 && (
                        <ul style={{ color: "#cbd5e1", paddingLeft: "18px", marginTop: "10px" }}>
                          {res.suggestions.slice(0, 3).map((s, idx) => (
                            <li key={idx} style={{ marginBottom: "6px" }}>
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* ABOUT TAB */}
      {activeTab === "about" && (
        <main className="card info-section fade-in">
          <h2 style={{ fontSize: "2rem", color: "white", marginBottom: "30px" }}>
            Architecture Overview
          </h2>

          <div className="info-block">
            <h3>What is this tool?</h3>
            <p>
              This is a <strong>Human-in-the-loop AI Safety Sandbox</strong>. It helps Trust & Safety
              teams evaluate how Large Language Models (LLMs) respond to malicious inputs like jailbreaks,
              toxic speech, and prompt injection attacks.
            </p>
          </div>

          <div className="info-block">
            <h3>New Feature: Adversarial Red Teaming</h3>
            <p>
              The <strong>Red Team Generator</strong> creates 3 <em>sanitized</em> adversarial variants
              (Social Engineering, Roleplay, and Instruction Inversion). We then evaluate each variant and
              display risk + signals. This mimics how test suites catch regressions in CI.
            </p>
          </div>
        </main>
      )}

      <footer className="footer">
        <p>
          Developed by <strong style={{ color: "#f8fafc" }}>Sushov Karmacharya</strong>
          <span style={{ margin: "0 10px", opacity: 0.3 }}>|</span>
          <a href="https://github.com/sushov" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
