

#  AI Safety Shield

**A professional-grade Red Teaming & Prompt Safety Evaluation tool for Large Language Models (LLMs).**

---

## Overview

**AI Safety Shield** is a security-focused evaluation dashboard designed to test how Large Language Models (LLMs) respond to **malicious, manipulative, and adversarial prompts**.

Instead of relying on fragile keyword blocklists, the system combines:

* **Deterministic rule-based safety signals**
* **Model-based risk classification using a secondary LLM**
* **Automated adversarial red teaming**
* **Batch-style evaluation inspired by CI pipelines**

The goal is to **treat prompts as untrusted input** and **AI safety as something you can continuously test and regression-check**.

---

##  What This Tool Evaluates

AI Safety Shield analyzes user prompts for:

* **Jailbreak Attempts**
  (e.g., instruction overrides, roleplay coercion, “ignore previous rules”)

* **Social Engineering & Intent Laundering**
  (e.g., “for research”, “security audit”, “compliance testing”)

* **Sensitive Target Extraction**
  (system prompts, internal configuration, developer mode, secrets)

* **Dangerous & Disallowed Content**
  (violence, illicit activity, harmful instructions)

* **False Positives**
  (ensuring benign prompts are not incorrectly flagged)

---

##  Key Features

###  Hybrid Safety Evaluation (Rules + LLM)

The system uses **two layers of protection**:

* **Deterministic rule checks**
  Detect known jailbreak patterns and sensitive targets that should *always* be high risk.

* **Model-based safety classification (Gemini)**
  Interprets intent, context, and ambiguity to provide nuanced scoring and explanations.

If a prompt requests sensitive system information, a **risk floor** is applied — even if the model underestimates the threat.

> This prevents polite or cleverly worded attacks from slipping through.

---

###  Structured JSON Enforcement

All AI responses are constrained to **strict JSON schema output**, ensuring:

* Reliable parsing
* Consistent UI rendering
* No hallucinated or free-form responses

Each analysis returns:

* `riskScore` (0–100)
* `summary`
* `categories`
* `suggestions`
* `deterministic safety signals`

---

###  Safe-by-Design Automated Red Teaming

The **Red Team mode** automatically generates **sanitized adversarial variants** of a prompt using common attack styles:

* Social Engineering
* Roleplay Coercion
* Instruction Inversion

**Important:**
The system does **not** generate real secret-extraction prompts.
All adversarial variants preserve the *attack style* without requesting actual sensitive data, making them safe to store, test, and run in CI environments.

Each variant is then **automatically evaluated**, simulating how attackers probe systems in the real world.

---

###  Promptfoo-Style Batch Evaluation

The backend supports evaluating **multiple prompts in a single run**, producing:

* Per-prompt risk scores
* Aggregate statistics (average & max risk)
* Regression-friendly output

This mirrors how modern teams test prompts before deploying them to production.

---

###  Cyber-Intel Dashboard UI

A dark-mode interface inspired by enterprise security tooling (Splunk, CrowdStrike), featuring:

* Traffic-light risk scoring
* Deterministic signal badges (why a prompt is risky)
* Clear, explainable summaries
* Clean separation between single analysis and red-team results

---

## Architecture Overview

```
User Prompt
     |
     v
Rule-Based Signal Detection
     |
     v
LLM Safety Classifier (Gemini)
     |
     v
Risk Floor Enforcement
     |
     v
Final Risk Report (JSON)
     |
     v
React Security Dashboard
```

### Red Team Flow

```
Original Prompt
      |
      v
Sanitized Red Team Generator
      |
      v
Adversarial Variants (3)
      |
      v
Batch Safety Evaluation
      |
      v
Threat Intelligence View
```

---

## Why This Design Matters

* **LLMs can be fooled by tone and framing**
  → deterministic rules catch known bad patterns

* **Rules alone lack context**
  → model-based analysis adds nuance

* **Attackers don’t try once**
  → automated red teaming tests multiple vectors

* **Safety must be testable**
  → batch evaluation enables regression detection

This is how **real AI safety and trust systems are built**.

---

## Tech Stack

**Frontend**

* React (Vite)
* CSS3 (custom variables & grid)

**Backend**

* Node.js
* Express
* Rate limiting & timeout handling

**AI Engine**

* Google Gemini API (`gemini-2.5-flash-lite`)
* Structured JSON output
* Safety classifier mode

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/sushov/ai-safety-shield.git
cd ai-safety-shield
```

---

### Backend Setup (Port 3001)

```bash
npm install express cors dotenv node-fetch
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_google_api_key_here
```

> Obtain an API key from Google AI Studio.

---

### Frontend Setup (Port 5173)

```bash
npm install
```

---

## Running the Application

Run **two terminals**:

### Terminal 1 – Backend

```bash
node server/index.js
# Server running on http://localhost:3001
```

### Terminal 2 – Frontend

```bash
npm run dev
# ➜ Local: http://localhost:5173
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**

---

## ⚠️ Disclaimer

This project is intended **strictly for educational and defensive security research**.

It allows the input and analysis of potentially harmful text **solely to evaluate AI safety behavior**.
The author is **not responsible for misuse** of this tool.

---

## 👨‍💻 Author

**Sushov Karmacharya**

* GitHub: [https://github.com/sushov](https://github.com/sushov)
* LinkedIn: [https://www.linkedin.com/in/sushov-karmacharya/](https://www.linkedin.com/in/sushov-karmacharya/)

---

### *Built with ❤️ for AI Safety, Security Engineers, and Responsible LLM Development*

---
