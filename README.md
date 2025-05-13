# 🌿 GreenLens-AI

GreenLens-AI is an AI-powered web application designed to detect and classify plastic waste in images. Utilizing Google's Gemini 2.0 Flash model, it provides real-time analysis of mixed waste images, identifying plastic types, item descriptions, confidence scores, and bounding boxes. The application is built with Vite, React, TypeScript, Firebase, and Tailwind CSS.

---

## 🚀 Features

* **📷 Camera Integration**: Capture images directly from your webcam or mobile device camera and analyze them instantly.
* **🧠 AI-Powered Detection**: Detects and classifies plastic waste using Google's Gemini 2.0 Flash model.
* **📦 Detailed Classification**: Identifies plastic types (e.g., PET, HDPE) with confidence scores and bounding boxes.
* **🔐 User Authentication**: Secure login and registration using Firebase Authentication.
* **🗂️ Detection History**: Stores image analysis results in Firebase Firestore and displays them in the user's profile.
* **💬 Community Platform**: Engage with a dedicated social platform for eco-conscious users, featuring:
  * Awareness campaigns
  * Plastic-free lifestyle challenges
  * Event planning for cleanups
  * Collaboration with like-minded individuals and organizations
  * Functionality similar to X (formerly Twitter) but focused on environmental activism
* **💡 Responsive Design**: Fully mobile-ready and optimized UI using Tailwind CSS.

---

## 🛠️ Tech Stack

* **Frontend**: React, TypeScript, Vite, Tailwind CSS
* **Backend**: Firebase Authentication, Firestore
* **AI Model**: Google's Gemini 1.5 Flash (via REST API)
* **Camera Access**: `navigator.mediaDevices` API
* **State Management**: React Context API
* **Notifications**: Sonner for toast messages

---

🔗 **Live Demo**: [GreenLens AI](https://greenlens-ai.vercel.app/)

---

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Thorfinn05/GreenLens-AI.git
   cd GreenLens-AI
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following:

   ```env
   VITE_GEMINI_API_KEY=your_google_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

   > 📌 **Note**: `.env` is already listed in `.gitignore`.

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Usage

1. **📸 Use the Camera or Upload**:

   * Use your webcam/mobile camera to capture an image.
   * Or upload from local storage.

2. **🧠 Analyze the Image**:

   * Click the analyze button to detect plastics in the image.

3. **🔍 View Results**:

   * See bounding boxes, plastic types, confidence levels, and summaries.

4. **📂 Access Detection History**:

   * Previous analyses are saved to your Firebase account and can be viewed in the profile page.

5. **💬 Engage in the Community Platform**:

   * Participate in awareness campaigns.
   * Join plastic-free lifestyle challenges.
   * Plan and coordinate cleanup events.
   * Collaborate with like-minded individuals and organizations.

---

## 📁 Project Structure

```
GreenLens-AI/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🔐 Environment Variables

Set the following in your `.env` file:

```env
VITE_GEMINI_API_KEY=your_google_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 🚀 Deployment

To deploy the application on Vercel:

1. **Push to GitHub**: Ensure your latest code is pushed to a GitHub repository.
2. **Import to Vercel**: Go to [Vercel](https://vercel.com/import) and import your GitHub repository.
3. **Set Environment Variables**: In the Vercel dashboard, set the environment variables as listed above.
4. **Deploy**: Vercel will automatically build and deploy your application.

> **Note**: Vercel automatically runs `npm run build` during deployment.

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* [Google's Gemini 1.5 Flash](https://ai.google/)
* [Firebase](https://firebase.google.com/)
* [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/)

---

## 🔮 Future Plans

GreenLens-AI is not just a project—it's a vision for a greener, smarter, and more sustainable future. Here’s what’s coming next:

### 🌐 1. Blockchain-Based Reward System

* Integrate a blockchain-powered backend where users are **rewarded with airdrops** based on:

  * The **quantity** and **accuracy** of detected plastic waste.
  * Engagement in cleanup drives or awareness campaigns.
* Airdrops will act as tokens that can be **redeemed in the marketplace** or used to unlock exclusive community features.

### 🧑‍🤝‍🧑 2. Enhanced Community Platform

* Expand the social platform with:

  * User levels and achievements
  * Verified NGO accounts
  * Hashtag campaigns and live cleanup tracking

### 📘 3. Educational Hub

* Create a **Learning Page** for all age groups to understand:

  * The dangers of plastic pollution.
  * Long-term environmental effects.
  * Sustainable lifestyle practices.
  * **Alternatives to common plastic products**.

### 🛒 4. Green Marketplace

* A dedicated e-commerce section where users can:

  * **Buy eco-friendly alternatives** to plastic items.
  * **Redeem airdropped tokens** for discounts or purchases.
  * **Sell or exchange recycled or sustainable products.**

### 🧠 5. AI Model Enhancement

* Train and deploy a **CNN-based plastic detection model** for:

  * Greater precision and classification accuracy.
  * Offline/Edge deployment for mobile use.
  * Support for **real-time detection** with detailed segmentation.

### 🤝 6. Partnerships & Collaborations

* Collaborate with:

  * **NGOs working in waste management and recycling.**
  * **Eco-friendly product startups or farms.**
  * **Corporate sustainability initiatives.**
* Joint campaigns, data sharing, and ecosystem building.

---

## 📫 Contact

For queries, suggestions, or collaboration, reach out to [@Thorfinn05](https://github.com/Thorfinn05) and [@AitijhyaCoded](https://github.com/AitijhyaCoded)

---
