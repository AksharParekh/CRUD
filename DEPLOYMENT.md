Frontend (Vercel)

- Option A: Use Vercel dashboard
  1. Sign in to https://vercel.com and import the repository.
  2. When configuring the project, set the "Root Directory" to `frontend`.
  3. Framework preset: Next.js (should be detected). Set build command: `npm run build` and output: default.
  4. Add any environment variables (if your frontend needs them).
  5. Deploy.

- Option B: Use Vercel CLI (quick deploy from local)

  1. Install Vercel CLI:

```bash
npm i -g vercel
```

  2. From the repo root run:

```bash
cd frontend
vercel --prod
```

Notes:
- I added `frontend/vercel.json` so Vercel can detect the Next.js build.
- If you use the dashboard, setting the project root to `frontend` is sufficient.


Backend (Render)

1. Sign in to https://render.com and create a new Web Service.
2. Connect your repository and select the `backend` folder as the root.
3. Build command: `npm install`
4. Start command: `npm start` (already in `backend/package.json`)
5. Environment variables to add on Render:
   - `MONGO_URI` = your MongoDB connection string (required)
   - `ALLOWED_ORIGINS` = comma-separated allowed origins for CORS (e.g. `https://your-frontend.vercel.app`)
   - Any other secrets (e.g. API keys)

Important details and tips

- The backend now reads `ALLOWED_ORIGINS` from the environment (comma-separated). By default it allows `http://localhost:3000` and `http://localhost:3001`.
- After Render deploys, copy the frontend URL (e.g. `https://your-app.onrender.com`) into `ALLOWED_ORIGINS` on Render, and add the backend URL into any frontend environment variables if the frontend calls the API.
- For Socket.IO over CORS, ensure the origin(s) include the exact frontend hostname (including `https://`).
- Test the health endpoint after deployment: `GET https://<backend-url>/health` should return `{ ok: true, service: "blog-api" }`.

Troubleshooting

- If CORS/socket connections are blocked, verify `ALLOWED_ORIGINS` value on Render and restart the service.
- Check Render service logs for runtime errors and missing env vars.

Commands to run locally for testing

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
MONGO_URI="your-local-or-remote-mongo" node server.js
```
