# Egemen Portfolio

A modern, interactive developer portfolio built with clean, ESM-structured Vanilla JavaScript, CSS, and Firebase. Features multiple customizable themes, a secure admin panel, real-time visitor analytics, and an integrated contact form.

## Live Demo & Hosting

The application is optimized for deployment on **Vercel** and uses **Firebase** for backend and database services.

The live website is available at:

- [egemen.is-a.dev](https://egemen.is-a.dev) — Primary
- [muhammedegemen.is-a.dev](https://muhammedegemen.is-a.dev)
- [geyik.is-a.dev](https://geyik.is-a.dev)
- [gyk.is-a.dev](https://gyk.is-a.dev)
- [egemengeyik.is-a.dev](https://egemengeyik.is-a.dev)
- [egemngyk.is-a.dev](https://egemngyk.is-a.dev)
- [egemen-portfolio-six.vercel.app](https://egemen-portfolio-six.vercel.app)

---

## Features

- **Multi-Theme Engine:** More than 10 professionally designed themes, including Terminal, Cosmic, Minimal, Glass, Ledger, Midnight, Ivory, Brutalist, Royal, and Claudemade.
- **Admin Control Panel:** Manage portfolio projects, languages, and application settings directly through the web interface.
- **Real-Time Analytics:** A built-in, self-hosted analytics dashboard tracking unique visitors, average session duration, active projects, and page views.
- **Contact Form:** An interactive contact form that allows visitors to send messages, which can be viewed directly from the Admin Panel.
- **Offline Support & Performance:** Service Worker implementation for static resource caching and improved offline accessibility.
- **Environment-Based Configuration:** Firebase credentials and sensitive configuration values are managed through environment variables to protect the public repository.

---

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Vanilla HTML5, CSS3, ESM JavaScript Modules, Web Components |
| Backend & Database | Firebase Authentication, Firestore |
| Analytics & Performance | Custom JavaScript Analytics, Vercel Speed Insights |
| Hosting & Deployment | Vercel |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/egemngyk/egemen-portfolio.git
cd egemen-portfolio
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
FIREBASE_API_KEY="your-api-key"
FIREBASE_AUTH_DOMAIN="your-auth-domain"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_STORAGE_BUCKET="your-storage-bucket"
FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
FIREBASE_APP_ID="your-app-id"
ADMIN_EMAIL="admin@portfolio.dev"
```

Replace the placeholder values with your Firebase project credentials and administrator email.

### 3. Install Dependencies & Run

Install the required dependencies and start the local development server:

```bash
npm install
npm run dev
```

Alternatively, you can use `npx http-server` to serve the project locally.

---

## Deployment

The project is optimized for deployment on **Vercel**.

1. Import your GitHub repository into Vercel.
2. Navigate to **Settings → Environment Variables** in your Vercel project dashboard.
3. Add the required environment variables listed in the configuration section above.
4. Set the **Build Command** to:

   ```bash
   npm run build
   ```

5. Set the **Output Directory** to `.` or select the `Other` framework preset.
6. Deploy your project.

---

## License

This project is maintained by [Egemen Geyik](https://github.com/egemngyk).
