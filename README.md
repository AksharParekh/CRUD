# Next.js + Node.js CRUD with Real-Time Updates

This practical integrates a Next.js frontend with a Node.js + Express + MongoDB backend.
It supports full CRUD operations for blog posts and visualizes real-time updates using Socket.IO.

## Features

- Create, read, update, and delete blog posts
- Real-time sync across clients through `posts:changed` events
- Live connection status in the frontend
- Backend health check endpoint at `/health`

## Project Structure

- `backend/`: Express, Mongoose, Socket.IO API server
- `frontend/`: Next.js app (`/blog` and `/add` pages)

## Prerequisites

- Node.js 18+
- npm
- MongoDB running locally on `mongodb://127.0.0.1:27017/blogDB`

## Install

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Run

Open two terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Then open the frontend URL shown in terminal (typically `http://localhost:3000` or `http://localhost:3001`).

## Optional Environment Variables

Backend:

- `PORT` (default: `5000`)
- `MONGO_URI` (default: `mongodb://127.0.0.1:27017/blogDB`)

Frontend:

- `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000`)
- `NEXT_PUBLIC_SOCKET_URL` (default: same as API URL)
