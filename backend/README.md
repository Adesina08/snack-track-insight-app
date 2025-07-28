# Backend API

This directory contains a minimal Express server used by the Snack Track Insight application.

## Setup

```sh
cd backend
npm install
# Create a virtual environment in `.venv` and install the Python dependencies
python setup_env.py
# Ensure the `ffmpeg` binary is available for processing audio and video inputs.
# On Windows the setup script patches Whisper so it can locate the correct C runtime.
npm start
```

If a `.venv` directory exists, the server uses its Python interpreter when spawning the transcription script.

The server listens on `PORT` (defaults to `4000`) and uses the `DB_*` environment variables to connect to PostgreSQL. It also exposes a health endpoint at `/api/health` that returns `{ status: 'ok' }`.
During development the frontend's Vite server proxies `/api` requests to this port, so make sure it is running before interacting with the app.

### Environment variables

Copy the `.env.example` file from the repository root to `.env` in this directory and define at least the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=snackuser
DB_PASSWORD=snackpass
DB_NAME=snacktrack
PORT=4000
```

These values are loaded automatically at runtime using `dotenv`.
When connecting to a hosted database (e.g. Render or Heroku), provide the host, port, username and password from your provider. TLS is automatically enabled for any host that is not `localhost`.

Future API routes should be added to `server.js`.
