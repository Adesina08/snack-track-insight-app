# Backend API

This directory contains a minimal Express server used by the Snack Track Insight application.

## Setup

```sh
cd backend
npm install
pip install -r requirements.txt
npm start
```

The server listens on `PORT` (defaults to `4000`) and uses the `DATABASE_URL` environment variable to connect to PostgreSQL. It also exposes a health endpoint at `/api/health` that returns `{ status: 'ok' }`.

### Environment variables

Copy the `.env.example` file from the repository root to `.env` in this directory and define at least the following variables:

```env
DATABASE_URL=postgres://snackuser:snackpass@localhost:5432/snacktrack
PORT=4000
```

These values are loaded automatically at runtime using `dotenv`.
When connecting to a hosted database (e.g. Render or Heroku), make sure your
`DATABASE_URL` includes SSL settings or set the `ssl` options in `db.js`. The
server automatically enables TLS for any connection string that does not point
to `localhost`.

Future API routes should be added to `server.js`.
