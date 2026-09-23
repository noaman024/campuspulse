# 🚀 CampusPulse — Deployment, DevOps & Infrastructure Manual

**Version:** 1.0.0 (Production)  
**Classification:** DevOps & Systems Administration Guide  
**Platforms Supported:** Netlify, Docker / Docker Compose, Firebase App Hosting, Linux VPS  
**Last Updated:** September 2026  

---

## 1. Environment Variables Bible

CampusPulse requires specific environment variables for database connectivity, authentication tokens, and media uploads. Below is the complete configuration guide:

| Variable Name | Required | Default / Example Value | Description & Security Guidelines |
| :--- | :---: | :--- | :--- |
| `MONGODB_URI` | **YES** | `mongodb+srv://user:pass@cluster.mongodb.net/campuspulse?retryWrites=true&w=majority` | Connection string to your MongoDB Atlas cluster. Keep credentials confidential. |
| `NEXTAUTH_URL` | **YES** | `https://campuspulse.netlify.app` (or `http://localhost:3000`) | Canonical root URL of your deployed application. Must match the exact production domain. |
| `NEXTAUTH_SECRET` | **YES** | Generated via `openssl rand -base64 32` | Secret key used by NextAuth to encrypt and sign JWT session tokens. |
| `JWT_SECRET` | **YES** | Generated via `openssl rand -base64 32` | Secret key for custom token signing and ticket verification logic. |
| `UPLOAD_DIR` | Optional | `./public/uploads` | Path to persistent local directory for banner images and media uploads. |
| `APP_URL` | Optional | `https://campuspulse.netlify.app` | Target remote URL used by the native Android Capacitor build to load the web interface. |

> [!TIP]
> **Generating Cryptographically Secure Secrets:**
> ```bash
> # In PowerShell or Bash:
> openssl rand -base64 32
> ```

---

## 2. Netlify Deployment (Serverless Next.js 16)

CampusPulse is pre-configured for **100% free serverless hosting on Netlify**.

### 2.1 Configuration File (`netlify.toml`)
```toml
# netlify.toml
[build]
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 2.2 Step-by-Step Netlify Deployment Steps:
1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **"Add new site" > "Import an existing project"**.
3. Connect your GitHub account and select repository: `noaman024/campuspulse`.
4. Netlify will automatically detect Next.js and the `netlify.toml` file.
5. In **"Site configuration" > "Environment variables"**, add the required keys:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set to your Netlify site URL, e.g. `https://<site-name>.netlify.app`)
   - `JWT_SECRET`
6. Click **"Deploy site"**. Netlify will build and deploy the application.
7. Future commits pushed to `origin/main` will automatically trigger instant production redeployments.

---

## 3. Docker & Docker Compose Deployment (Self-Hosted / VPS)

For universities running internal institutional servers or cloud VPS (AWS EC2, DigitalOcean, Hetzner, Linode), CampusPulse includes a production-grade multi-stage Docker build.

### 3.1 Multi-Stage `Dockerfile` Architecture:
- **Stage 1 (`deps`):** Uses lightweight `node:20-alpine` to install exact dependencies via `npm ci`.
- **Stage 2 (`builder`):** Compiles the Next.js production build (`npm run build`) with telemetry disabled.
- **Stage 3 (`runner`):** Minimal Alpine container with a non-privileged `nextjs` system user (`UID 1001`) for enhanced container security.

### 3.2 Launching with Docker Compose:
The included `docker-compose.yml` mounts a persistent Docker volume (`uploads_data`) so that uploaded photos and media are never lost when the container is restarted:

```bash
# 1. Create .env.local with production credentials
# 2. Build and start the container in detached mode:
docker compose up -d --build

# 3. View live container logs:
docker compose logs -f

# 4. Stop the container:
docker compose down
```

The application will be accessible at `http://<your-server-ip>:3000`.

---

## 4. Google Cloud / Firebase App Hosting

For Google Cloud environments, CampusPulse includes native Firebase App Hosting specifications:
- **`apphosting.yaml`:**
  - Auto-scaling: `minInstances: 0`, `maxInstances: 4`
  - Resource allocation: `1 CPU`, `1024 MiB Memory`, `80 Concurrency`
  - Runtime environment variable bindings.
- **`firebase.json`:** Configures `frameworksBackend` targeting region `us-central1`.
- **`.firebaserc`:** Maps to default project `campuspulse-app-f6422`.

---

## 5. Production Health Monitoring & Maintenance

- **Log Auditing:** In Docker, run `docker logs campuspulse-app --tail 100`. In Netlify, review real-time deploy and function logs from the dashboard.
- **Database Maintenance:** Use the included database seeder (`node scripts/seed.js`) to re-sync default demo data or verify Atlas connectivity.
- **Backups:** Use MongoDB Atlas automated daily snapshots to protect student registrations and survey data.
