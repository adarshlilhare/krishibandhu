# 🌾 KrishiBandhu - AI Crop Assistant

KrishiBandhu is a comprehensive, AI-powered full-stack platform designed to empower farmers with advanced agricultural tools. By leveraging modern machine learning and a highly interactive, accessible interface, it provides intelligent disease detection, personalized crop advisory, and real-time market insights.

## 🌐 Live Demo

**[https://krishnabandhu.vercel.app](https://krishnabandhu.vercel.app)**

---

## ✨ Key Features

- **🔍 Disease Detection**: Upload clear images of plant leaves to instantly identify diseases using a highly trained Deep Learning vision model (`TensorFlow/Keras`).
- **🌱 Crop Advisory**: Receive custom, personalized crop recommendations tailored to specific soil conditions, geography, and climate parameters (`Scikit-Learn`).
- **📈 Market Insights**: Stay connected with the latest trends and access real-time market prices from local Mandis.
- **🎙️ Voice Navigation**: Fully hands-free navigation across the application enabled through intelligent speech recognition.
- **📱 Mobile App**: Seamlessly packaged Flutter-based Android wrapper available in the `mobile` directory for native experiences.

---

## 🛠️ Technology Stack

Our platform is divided into three robust architectural pillars:

### 1. Frontend (Web Application)
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS modules
- **Unique Feature**: Custom `useSpeechRecognition` hook for accessibility
- **Deployment**: Next.js optimized for Vercel

### 2. Backend (Node.js API)
- **Runtime**: Node.js
- **Server Framework**: Native routing / Light integrations
- **Key Modules**: `multer` for robust image upload processing, `axios` for external APIs
- **Structure**: MVC-style architecture with `controllers` and `routes`

### 3. ML Engine (Python FastAPI)
- **Framework**: FastAPI (Served via Uvicorn on port 8000)
- **Models**: TensorFlow / Keras (`disease_model.h5`), Scikit-Learn (`crop_recommender.pkl`)
- **Integration**: Secure REST APIs to interpret data relayed from the frontend

---

## 🚀 Getting Started locally

To run the project locally, please refer to the detailed **[GUIDE.md](./GUIDE.md)** which extensively covers:

1. Setting up prerequisites (Node.js, Python, Git).
2. Starting the Backend environment.
3. Running the ML Engine virtual environment.
4. Booting the Next.js Frontend.
5. Setup instructions for GitHub Codespaces.

---

## 📂 Project Structure

```text
KrishiBandhu/
├── backend/            # Processing server (Node.js) handling file uploads & external APIs
├── frontend/           # Next.js web application handling the UI, States and User Flow
├── ml_engine/          # FastAPI Python server managing the AI prediction requests
├── mobile/             # Flutter wrapper for the Android app release
├── GUIDE.md            # Detailed internal technical setup and troubleshooting guide
└── README.md           # Project Overview (This file)
```

---

## 📄 License
This project operates under the terms specified in the [LICENSE](./LICENSE) file.

Designed and developed independently by **Adarsh Lilhare**.
