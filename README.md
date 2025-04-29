
# 🧠 Smart Notes – AI-Powered Notes Application

[Live Demo](https://smartnotes-plum.vercel.app) • [GitHub Repo](https://github.com/Hrithik-12/smartnotes)

Smart Notes is a **full-stack AI-powered note-taking web application** designed to help users **write, organize, and understand notes more efficiently** with real-time syncing and intelligent summarization. The app leverages the **Gemini API** to provide smart insights and summaries, helping users boost productivity and note clarity.

---

## ✨ Features

- 📝 **Create & Edit Notes** with real-time updates
- 🧠 **AI Summarization** using Gemini API
- 🔒 **User Authentication** via Clerk
- ⚡ **Real-Time Sync** with Convex backend
- 🌙 **Responsive UI** with Tailwind CSS and shadcn/ui
- 📚 **Organize Notes** by folders or categories (optional)

---

## 🛠 Tech Stack

| Frontend        | Backend & Services     | AI & Auth         |
|-----------------|------------------------|-------------------|
| Next.js         | Convex (real-time DB)  | Gemini API (AI)   |
| Tailwind CSS    | REST API Integration   | Clerk (Auth)      |
| shadcn/ui       |                         |                   |

---

## Demo Video On LOOM
https://www.loom.com/share/3d9720dd77f0439ca59c0485a2a9c111?sid=8aa66b67-9675-42fb-bd04-d39ec92add47

## Screenshots 
<img width="1470" alt="Screenshot 2025-04-29 at 1 30 06 PM" src="https://github.com/user-attachments/assets/4a3f8a71-8818-4de7-bc82-200777dd516b" />
<img width="1470" alt="Screenshot 2025-04-29 at 1 27 40 PM" src="https://github.com/user-attachments/assets/c716fd28-b1dd-477f-b2db-98a5fd41fb57" />
<img width="1470" alt="Screenshot 2025-04-29 at 1 27 27 PM" src="https://github.com/user-attachments/assets/e346793a-f9c0-467e-95fb-4ac3ae1626ff" />
<img width="1470" alt="Screenshot 2025-04-29 at 1 27 05 PM" src="https://github.com/user-attachments/assets/d734b8b6-294e-46e4-95a5-3c2cc87d4834" />
<img width="1470" alt="Screenshot 2025-04-29 at 1 26 46 PM" src="https://github.com/user-attachments/assets/cb5365fa-098e-4178-9520-d92bd97425df" />
<img width="1470" alt="Screenshot 2025-04-29 at 1 26 32 PM" src="https://github.com/user-attachments/assets/530b80ab-3773-49cc-8493-01efbd562620" />
<img width="1470" alt="Screenshot 2025-04-29 at 1 26 18 PM" src="https://github.com/user-attachments/assets/759d3695-fd8e-441c-bd3d-177eeaa39112" />




---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Hrithik-12/smartnotes.git
cd smartnotes
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CONVEX_DEPLOYMENT_NAME=your_convex_project_name
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

> Make sure you’ve set up **Convex**, **Clerk**, and **Gemini API** accounts and created the appropriate projects.

### 4. Run the App Locally

```bash
npm run dev
```

The app will run at `http://localhost:3000`

---

## 📦 Project Structure (Simplified)

```
smartnotes/
├── app/                # Next.js app router structure
├── convex/             # Convex backend logic
├── components/         # Reusable UI components (shadcn/ui)
├── lib/                # Utility functions
├── pages/              # Fallback for certain routes
├── public/
├── styles/
└── .env.local          # Environment variables
```

---

## 💡 What I Learned

- Prompt engineering and AI integration using **Gemini API**
- Real-time state management and data flow with **Convex**
- Scalable authentication using **Clerk**
- Clean UI design with **shadcn/ui** and **Tailwind CSS**
- Full-stack app architecture using **Next.js (App Router)**

---

## 📫 Contact

**Hrithik Garg**  
[LinkedIn](https://www.linkedin.com/in/hrithikgarg1/) • [GitHub](https://github.com/Hrithik-12)

---

## 🏁 Future Enhancements

- 🗂️ Add tags or categories for notes
- 🔎 Implement global search and filter
- 📱 Improve mobile UX further
- 🌐 Add multilingual AI summaries using Gemini

---
