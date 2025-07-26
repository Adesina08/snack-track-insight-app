# Backend API

This directory contains a minimal Express server used by the Snack Track Insight application.

## Setup

```sh
cd backend
npm install
pip install -r requirements.txt
npm start
```

The server listens on `PORT` (defaults to `4000`) and exposes a health endpoint at `/api/health` that returns `{ status: 'ok' }`.

Future API routes should be added to `server.js`.
