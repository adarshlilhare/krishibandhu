# KrishiBandhu - AI Crop Assistant

KrishiBandhu is an AI-powered platform designed to assist farmers with disease detection, crop advisory, and market insights.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/YOUR_USERNAME/KrishiBandhu)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

## Quick Start (Cloud)

Click the **"Open in GitHub Codespaces"** badge above to launch the project directly in your browser. All dependencies (Node.js, Python, MongoDB) will be installed automatically.

Once inside Codespaces:
1.  Wait for the "Installing Dependencies..." step to finish in the terminal.
2.  Run the 3 components in separate terminals as usual (see below).

## Getting the Code

First, clone the repository to your local machine:
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd krishibandhu
```

## Installation & Setup (Local)

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
cd backend
# On Windows (PowerShell/CMD):
npm.cmd install
# On Mac/Linux:
# npm install
```
Create a `.env` file in the `backend` directory (if not exists) with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/krishibandhu
JWT_SECRET=your_secret_key
```

### 2. ML Engine Setup
Navigate to the ML engine directory and set up the Python environment:
```bash
cd ml_engine
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
cd frontend
# On Windows (PowerShell/CMD):
npm.cmd install
# On Mac/Linux:
# npm install
```

## Running the Application

You need to run all three services simultaneously in separate terminal windows.

**Terminal 1: Backend**
```bash
cd backend
cd backend
# On Windows (PowerShell/CMD):
npm.cmd start
# On Mac/Linux:
# npm start
```
*Server runs on http://localhost:5000*

**Terminal 2: ML Engine**
```bash
cd ml_engine
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
*ML Service runs on http://localhost:8000*

**Terminal 3: Frontend**
```bash
cd frontend
cd frontend
# On Windows (PowerShell/CMD):
npm.cmd run dev
# On Mac/Linux:
# npm run dev
```
*App runs on http://localhost:3000*

## Uploading to GitHub

1.  **Initialize Git:**
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create Repository:**
    - Go to GitHub and create a new repository.
    - Copy the repository URL (e.g., `https://github.com/username/repo-name.git`).

3.  **Push to GitHub:**
    ```bash
    git branch -M main
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```

## Troubleshooting Common Issues

*   **SecurityError / PSSecurityException**: If you see an error about `npm.ps1` not being digitally signed, use `npm.cmd` instead of just `npm`.
    *   Example: `npm.cmd run dev`
*   **Missing Modules**: Ensure you run `npm.cmd install` in both `backend` and `frontend` folders, and `pip install -r requirements.txt` in `ml_engine`.
*   **Port In Use**: If a port (3000, 5000, 8000) is busy, kill the process using that port or change the port in `.env` / code.


## Features
- **Disease Detection**: Upload plant leaf images to detect diseases.
- **Crop Advisory**: Get recommendations based on soil parameters.
- **Market Insights**: View real-time market prices.

## Running the Mobile App (Android)

The repository now includes a Flutter-based mobile application wrapper in the `mobile` directory.

### Run on a Physical Device or Emulator
1. Install [Flutter SDK](https://docs.flutter.dev/get-started/install) and Android Studio.
2. Connect your Android device via USB (with USB Debugging enabled) or start an Android Emulator.
3. Open a terminal and navigate to the mobile folder:
   ```bash
   cd mobile
   flutter run
   ```

### Build a shareable APK
To generate an installable `.apk` file:
1. Navigate to the mobile folder:
   ```bash
   cd mobile
   ```
2. Run the build command:
   ```bash
   flutter build apk
   ```
3. The generated file will be located at:
   `mobile/build/app/outputs/flutter-apk/app-release.apk`

Transfer this file to any Android device to install the KrishiBandhu application.

"# krishibandhu" 

