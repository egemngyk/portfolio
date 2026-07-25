# Egemen Portfolio

A premium, modern, and highly interactive developer portfolio website. Built with clean ESM-structured Vanilla JS, CSS, and Firebase, featuring multiple customizable themes, a secure admin control panel, real-time visitor stats, and a contact form.

## 🚀 Live Demo & Hosting
The application is optimized for deployment on **Vercel** and connects directly to **Firebase** for backend database services.

You can visit the live website at any of the following domains:
- 🌐 [egemen.is-a.dev](https://egemen.is-a.dev) (Primary)
- 🌐 [muhammedegemen.is-a.dev](https://muhammedegemen.is-a.dev)
- 🌐 [geyik.is-a.dev](https://geyik.is-a.dev)
- 🌐 [gyk.is-a.dev](https://gyk.is-a.dev)
- 🌐 [egemengeyik.is-a.dev](https://egemengeyik.is-a.dev)
- 🌐 [egemngyk.is-a.dev](https://egemngyk.is-a.dev)
- 🌐 [egemen-portfolio-six.vercel.app](https://egemen-portfolio-six.vercel.app)

---

## ✨ Features
- 🎨 **Multi-Theme Engine**: 10+ premium designed themes (Terminal, Cosmic, Minimal, Glass, Ledger, Midnight, Ivory, Brutalist, Royal, Claudemade).
- 🔐 **Admin Control Panel**: Manage your portfolio projects, languages, and settings directly from the web interface.
- 📊 **Real-time Analytics**: Built-in self-hosted database dashboard tracking unique visitors, average durations, active projects, and page views.
- 📬 **Interactive Contact Form**: Allows visitors to leave messages, which are instantly readable in the Admin Panel.
- ⚡ **Offline Support & Speed**: Service Worker implementation for static resource caching and offline resilience.
- 🔒 **Secrets Protection**: Credentials and Firebase configurations are externalized into environment variables to keep your public repository safe.

---

## 🛠️ Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, ESM JavaScript Modules, Web Components
- **Backend/Database**: Firebase (Authentication, Firestore Database)
- **Analytics & Speed**: Custom JS Analytics, Vercel Speed Insights
- **Hosting/Deployment**: Vercel

---

## 📦 Getting Started & Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/egemngyk/egemen-portfolio.git
cd egemen-portfolio
```

### 2. Configure Environment Variables
Create a `.env` file at the root of the project:
```env
FIREBASE_API_KEY="your-api-key"
FIREBASE_AUTH_DOMAIN="your-auth-domain"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_STORAGE_BUCKET="your-storage-bucket"
FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
FIREBASE_APP_ID="your-app-id"
ADMIN_EMAIL="admin@portfolio.dev"
```

### 3. Build & Run
Install dependencies (or use `npx http-server` directly) and start the local development server:
```bash
# Install packages
npm install

# Run build and start development server
npm run dev
```

---

## ☁️ Deploying to Vercel

To deploy your portfolio securely on Vercel:

1. Connect your repository to Vercel.
2. In your Vercel Project Dashboard, navigate to **Settings > Environment Variables**.
3. Add the keys from your `.env` file (`FIREBASE_API_KEY`, `ADMIN_EMAIL`, etc.) as Vercel Environment Variables.
4. Set the **Build Command** to: `npm run build`.
5. Set the **Output Directory** to: `.` (or select `Other` framework).
6. Deploy!
