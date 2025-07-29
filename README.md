

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
Ensure `npm start` is running in the project root so API requests succeed during development.
```

To run the **backend** API server (requires Python and the `openai-whisper` package; `ffmpeg` must be installed):

```sh
npm install # from the project root
# Creates a `.venv` folder and installs Python packages inside it
python setup_env.py
npm start
```

On Windows the startup script automatically patches the Whisper dependency so it
loads the correct C runtime (`msvcrt.dll`). If a `.venv` directory is present,
the backend automatically uses its Python interpreter when processing uploads.

The server automatically creates an `uploads` folder for media files if it does not exist.

### Environment Variables

Create a `.env` file in the project root for local development and define the following variables. In production, set them in your hosting provider's configuration (for Azure use **App Settings**):

VITE_JWT_SECRET=<your secret key>
DB_HOST=localhost
DB_PORT=5432
DB_USER=snackuser
DB_PASSWORD=snackpass
DB_NAME=snacktrack
AZURE_STORAGE_CONNECTION_STRING=<your connection string>
AZURE_AUDIO_CONTAINER=audio-logs
AZURE_MEDIA_CONTAINER=media-logs
```

The server reads these values from environment variables at runtime. For Azure deployments define them in **App Settings** so `process.env` contains the required values.

The app requires `VITE_JWT_SECRET` for authentication tokens. The `DB_*` variables define the PostgreSQL connection used by the backend. When deploying on services like Render, use the host, port, username and password provided by the platform. SSL is automatically enabled for any host that is not `localhost`.

If `AZURE_STORAGE_CONNECTION_STRING` is provided, uploaded audio and video files are automatically pushed to the specified storage containers (`AZURE_AUDIO_CONTAINER` for audio-only logs and `AZURE_MEDIA_CONTAINER` for video or mixed media). If these variables are not set the files are saved locally in `uploads`.

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

### Deploying to Azure

The frontend is published using **Azure Static Web Apps** (`.github/workflows/azure-static-web-apps-witty-stone-092422e03.yml`). To deploy the Express backend on **Azure Web App**, a workflow is provided at `.github/workflows/azure-backend-webapp.yml`.

1. Create an Azure Web App for the backend and download its publish profile. Add the profile as the repository secret `AZURE_WEBAPP_PUBLISH_PROFILE`.
2. Set the `AZURE_WEBAPP_NAME` environment variable in the workflow (replace `<your-backend-app>` with your actual app name).
3. The workflow installs Node dependencies and then runs `python setup_env.py` to create a `.venv` folder with the Python Whisper dependencies before packaging the app.

Requests from the static site to `/api` are proxied to the backend using `frontend/staticwebapp.config.json`. Update this file with your backend domain so the frontend can communicate with the API once deployed.
If the frontend and backend appear disconnected, verify that this file points to your deployed backend's URL.
