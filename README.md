# 📝 Full Stack Note-Taking App

A modern, fully-functional note-taking web application built with React (TypeScript), Supabase, and Tailwind CSS. This project allows users to securely sign up, sign in, and manage personal notes with a mobile-friendly, sleek UI inspired by the provided design.

## 🌐 Live Demo

🔗 [https://your-deployed-url.vercel.app](https://your-deployed-url.vercel.app)

---

## ✅ Features

- **Authentication**
  - Sign up via email/password with email verification
  - Full validation for inputs, and API errors

- **Notes Management**
  - Create, read, update, and delete notes
  - Notes are private and user-specific
  - Styled with meaningful icons and smooth UX

- **User Profile**
  - Displays user's full name, email, and phone
  - Data loaded from Supabase `profiles` table

- **UI/UX**
  - Clean, responsive layout using TailwindCSS
  - Toast notifications for success and error handling
  - Optimized for both desktop and mobile devices

---

## 🛠 Tech Stack

| Layer         | Technology              |
|---------------|--------------------------|
| Frontend      | React (TypeScript), Vite |
| Styling       | TailwindCSS, ShadCN UI   |
| Backend/Auth  | Supabase (Auth + DB)     |
| Database      | PostgreSQL (via Supabase)|
| State         | React Hooks, Zustand     |
| Deployment    | Vercel + Supabase        |
| Icons         | Lucide Icons             |

---

## 📁 Folder Structure

src/
│
├── components/ # Reusable UI components (Button, Card, etc.)
├── hooks/ # Toast hook and utility hooks
├── pages/ # Auth and dashboard routes
├── integrations/ # Supabase client setup and types
├── assets/ # Fonts, images (from provided asset link)
└── App.tsx # Main app entry


---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/note-taking-app.git
cd note-taking-app


npm install
# or
yarn install


✅ Deployment
Frontend: Vercel

Backend/Auth/DB: Supabase


📌 Author
Built by Partha Jyoti Cheleng
Finalized and tested for production deployment
📬 Reach out for collaboration or deployment help!

