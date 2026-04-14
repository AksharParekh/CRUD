Frontend on Vercel + Backend on Render

1) Push clean repository content first

- Make sure your repository includes source files from `frontend/` and `backend/`.
- Do not commit generated folders like `node_modules` or `.next`.

2) Deploy backend on Render

1. Sign in to https://render.com.
2. Create `New` -> `Web Service`.
3. Select your GitHub repo.
4. Set `Root Directory` to `backend`.
5. Runtime: `Node`.
6. Build command: `npm install`.
7. Start command: `npm start`.
8. Add environment variables:
  - `MONGO_URI` = your MongoDB connection string.
  - `FRONTEND_URL` = your Vercel app URL (set this after frontend deploy).
  - Optional: `ALLOWED_ORIGINS` = comma-separated list of allowed origins.
9. Deploy and copy the backend URL, for example `https://your-api.onrender.com`.

3) Deploy frontend on Vercel

1. Sign in to https://vercel.com.
2. Click `New Project` and import this GitHub repo.
3. Set `Root Directory` to `frontend`.
4. Confirm framework is `Next.js`.
5. Add environment variables:
  - `NEXT_PUBLIC_API_URL` = your Render backend URL.
  - Optional: `NEXT_PUBLIC_SOCKET_URL` = your Render backend URL.
6. Deploy.

4) Connect both apps

1. Copy the Vercel frontend URL.
2. In Render service env vars, set/update `FRONTEND_URL` with the Vercel URL.
3. If you use `ALLOWED_ORIGINS`, include the Vercel URL there too.
4. Redeploy Render service.
5. Redeploy Vercel project if frontend env vars were added after first deploy.

5) Verify

1. Open frontend URL and test Create, Read, Update, Delete.
2. Verify backend health endpoint:
  - `GET https://<your-render-url>/health`
3. If real-time updates fail, verify `NEXT_PUBLIC_SOCKET_URL` and CORS env values.

Troubleshooting

- If Vercel cannot see your frontend project files, confirm `frontend` is not a git submodule pointer and is committed as regular files.
- If CORS errors happen, ensure `FRONTEND_URL` and/or `ALLOWED_ORIGINS` exactly match your Vercel domain (`https://...`).
- Check Render logs for missing env vars or MongoDB connection errors.
