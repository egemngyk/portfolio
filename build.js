import fs from 'fs';
import path from 'path';

// 1. Load .env file manually to avoid external dependencies
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals === -1) return;
    const key = trimmed.slice(0, firstEquals).trim();
    let val = trimmed.slice(firstEquals + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
}

const variables = {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@portfolio.dev',
};

// Helper function to build a file from its template
function buildFile(templatePath, outputPath) {
  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    return;
  }
  let content = fs.readFileSync(templatePath, 'utf8');
  Object.keys(variables).forEach((key) => {
    const placeholder = `%%${key}%%`;
    content = content.replaceAll(placeholder, variables[key]);
  });
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Generated: ${outputPath}`);
}

// Generate the final JavaScript files
buildFile(
  path.resolve('firebase/firebase.template.js'),
  path.resolve('firebase/firebase.js')
);

buildFile(
  path.resolve('shared/panel-loader.template.js'),
  path.resolve('shared/panel-loader.js')
);

console.log('Build completed successfully!');
