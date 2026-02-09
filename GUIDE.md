# KrishiBandhu Project Guide

This guide provides step-by-step instructions on how to set up, run, and upload the KrishiBandhu project to GitHub.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js**: [Download Here](https://nodejs.org/) (Required for Frontend & Backend)
- **Python**: [Download Here](https://www.python.org/) (Required for ML Engine)
- **Git**: [Download Here](https://git-scm.com/) (Required for Version Control)

## 2. Running the Project

### Option A: Run in Browser (GitHub Codespaces)
1.  Upload this project to GitHub (see Section 3).
2.  In your repository, click the green **Code** button -> **Codespaces** -> **Create codespace on main**.
3.  Wait for the setup to complete (it will install everything for you).
4.  Run the commands in **Option B** (Step 1, 2, 3) to start the servers.

### Option B: Run Locally
The project consists of three parts: **Backend**, **Frontend**, and **ML Engine**. You need to run them in **three separate terminal windows**.

### Step 1: Start the Backend
1. Open a terminal/command prompt.
2. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
3. Install dependencies (first time only):
   ```powershell
   npm install
   ```
4. Start the server:
   ```powershell
   # On Windows (Standard):
   npm start
   # On Windows (If script errors occur):
   npm.cmd start
   ```
   *Expected Output: `Server running on port 5000`*

### Step 2: Start the ML Engine
1. Open a **new** terminal window.
2. Navigate to the ML engine directory:
   ```powershell
   cd ml_engine
   ```
3. Create a virtual environment (optional but recommended):
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
4. Install dependencies (first time only):
   ```powershell
   pip install -r requirements.txt
   ```
5. Start the ML server:
   ```powershell
   python main.py
   ```
   *Expected Output: `Uvicorn running on http://0.0.0.0:8000`*

### Step 3: Start the Frontend
1. Open a **third** new terminal window.
2. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
3. Install dependencies (first time only):
   ```powershell
   npm install
   ```
4. Start the development server:
   ```powershell
   # On Windows (Standard):
   npm run dev
   # On Windows (If script errors occur):
   npm.cmd run dev
   ```
5. Open your browser and visit: `http://localhost:3000`

---

## 3. Uploading to GitHub

Follow these steps to upload your project to GitHub.

### Step 1: Create a Repository on GitHub
1. Go to [GitHub.com](https://github.com/) and log in.
2. Click the **+** icon in the top right and select **New repository**.
3. Name your repository (e.g., `KrishiBandhu`).
4. **Do not** initialize with README, .gitignore, or License (since you already have code).
5. Click **Create repository**.

### Step 2: Initialize Git Locally
Open a terminal in the root folder of your project (`Epics_project`) and run:

```powershell
# Initialize git
git init

# Add all files to staging
git add .
```

### Step 3: Commit and Push
Replace `YOUR_GITHUB_URL` with the URL of the repository you just created (e.g., `https://github.com/username/KrishiBandhu.git`).

```powershell
# Commit the changes
git commit -m "Initial commit - Project setup with Backend, Frontend, and ML Engine"

# Rename branch to main
git branch -M main

# Link your local repo to GitHub
git remote add origin YOUR_GITHUB_URL

# Push the code
git push -u origin main
```

---

## 4. Troubleshooting

- **'npm' is not recognized**: Ensure Node.js is installed and added to your PATH.
- **'python' is not recognized**: Ensure Python is installed and added to your PATH.
- **Module not found**: Run `npm install` (for JS) or `pip install -r requirements.txt` (for Python) in the respective directory.
- **Port already in use**: ensure no other terminals are running the servers. You can close all terminals and start fresh.
