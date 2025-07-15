# Nexium_Areesha_Assign2 – Blog Summariser

A web app that fetches a blog from a given URL, summarizes the content, translates it into Urdu using a dictionary, and stores:

- The **summary** in Supabase.
- The **full blog text** in MongoDB.

---

## 🚀 Features

- Blog URL input and summary generation
- Urdu translation via static dictionary
- Summary saved in Supabase
- Full blog saved in MongoDB
- Built using Next.js 15 + ShadCN UI + Framer Motion
- Deployed to Vercel

---

## 📦 Technologies

- Next.js
- Supabase
- MongoDB
- TailwindCSS
- ShadCN UI
- Framer Motion
- Node-fetch + Unfluff

---

## ⚙️ Setup

1. Clone the repo  
   `git clone https://github.com/areesha5/Nexium_Areesha_Assign2.git`

2. Install dependencies  
   `npm install`

3. Create a `.env` in root with:

```env
MONGO_URI=your_mongo_connection_string
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_key
