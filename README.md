

## Project info

**Use your preferred IDE**

Snacks Track Insight App - A comprehensive food consumption tracking application.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps for the **frontend**:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
cd frontend
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

The Vite server proxies requests from `/api` to the backend running on port `4000`.
Ensure `npm start` is running inside `backend` so API requests succeed during development.
```

To run the **backend** API server (requires Python and the `openai-whisper` package; `ffmpeg` must be installed):

```sh
cd backend
npm install
# Creates a `.venv` folder and installs Python packages inside it
python setup_env.py
npm start
```

On Windows the startup script automatically patches the Whisper dependency so it
loads the correct C runtime (`msvcrt.dll`). If a `.venv` directory is present,
the backend automatically uses its Python interpreter when processing uploads.

The server automatically creates an `uploads` folder for media files if it does not exist.

### Environment Variables

Copy `.env.example` to `.env` in the project root (or use your hosting provider's configuration) and define the following variables:

VITE_JWT_SECRET=<your secret key>
DB_HOST=localhost
DB_PORT=5432
DB_USER=snackuser
DB_PASSWORD=snackpass
DB_NAME=snacktrack
```

The app requires `VITE_JWT_SECRET` for authentication tokens. The `DB_*` variables define the PostgreSQL connection used by the backend. When deploying on services like Render, use the host, port, username and password provided by the platform. SSL is automatically enabled for any host that is not `localhost`. Media files are stored locally in the `backend/uploads` directory.

### Local database

Data is persisted in PostgreSQL. The backend will automatically create the necessary tables and seed a few rewards on first run. Ensure a local PostgreSQL server is running and the `DB_*` variables are set appropriately.


docker run --name snacktrack-postgres -e POSTGRES_USER=snackuser \
  -e POSTGRES_PASSWORD=snackpass -e POSTGRES_DB=snacktrack \
  -p 5432:5432 -d postgres

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


### Logging meals

On the log consumption page you can switch between **Manual Entry** and **AI Capture**. Manual entry only shows the meal form, while AI Capture also records audio or video which is transcribed using Whisper.
