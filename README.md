

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

To run the **backend** API server install the Node.js dependencies:

```sh
npm install # from the project root
npm start
```

The server automatically creates an `uploads` folder for media files if it does not exist.

### Environment Variables

Create a `.env` file in the project root for local development and define the following variables. In production, set them in your hosting provider's configuration (for Azure use **App Settings**). When running on Azure (detected via `WEBSITE_INSTANCE_ID`) the server ignores `.env` files and only uses values from the environment:

VITE_JWT_SECRET=<your secret key>
VITE_API_BASE_URL=<deployed backend URL>
# Frontend access to Azure Speech
VITE_AZURE_SPEECH_KEY=<your speech key>
VITE_AZURE_REGION=<your speech region>
# Use only the domain, not the `/api` path. The app will automatically
# append `/api` when contacting the backend.
CORS_ORIGIN=<allowed domains>
DB_HOST=localhost
DB_PORT=5432
DB_USER=snackuser
DB_PASSWORD=snackpass
DB_NAME=snacktrack
AZURE_STORAGE_CONNECTION_STRING=<your connection string>
AZURE_AUDIO_CONTAINER=audio-logs
AZURE_MEDIA_CONTAINER=media-logs
AZURE_SPEECH_KEY=<your speech key>
AZURE_SPEECH_REGION=<your speech region>
AZURE_TEXT_ANALYTICS_ENDPOINT=<your text analytics endpoint>
AZURE_TEXT_ANALYTICS_KEY=<your text analytics api key>
```

`VITE_API_BASE_URL` is optional when the frontend and backend are served from the same domain. Set it to your backend URL when running the frontend locally against a remote API.
`CORS_ORIGIN` specifies which domains may access the API. Provide your deployed frontend's URL (or a comma-separated list) so browsers can make cross-origin requests.

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

On the log consumption page you can switch between **Manual Entry** and **AI Capture**. Manual entry only shows the meal form, while AI Capture also records audio or video which is transcribed using Azure Speech to Text when credentials are provided (otherwise Whisper is used).
When `VITE_AZURE_SPEECH_KEY` and `VITE_AZURE_REGION` are set the browser uploads recordings directly to Azure, bypassing the `/api/transcribe` route.

### Deploying to Azure

You can publish the frontend using **Azure Static Web Apps** and deploy the Express backend to **Azure Web App**. Configure your preferred CI/CD solution or deploy manually as needed.

Requests from the static site to `/api` are proxied to the backend using `frontend/staticwebapp.config.json`. Update this file with your backend domain so the frontend can communicate with the API once deployed. If the frontend and backend appear disconnected, verify that this file points to your deployed backend's URL.

The `/api/transcribe` endpoint now sends uploaded audio directly to the Azure
Speech Service. When `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` are provided
the server forwards the file to Azure and returns the recognized text. If the
request fails the server returns the detailed error message from Azure so you
can diagnose configuration issues.

The `/api/analyze` endpoint runs Azure Text Analytics on a block of text and
returns its sentiment and key phrases. Provide
`AZURE_TEXT_ANALYTICS_ENDPOINT` and `AZURE_TEXT_ANALYTICS_KEY` to enable this
feature.

When transcription fails the server now returns the underlying error message in
the response to help diagnose issues such as missing `ffmpeg` or invalid Azure
credentials.

The `/api/analyze` endpoint runs Azure Text Analytics on a block of text and
returns its sentiment and key phrases. Provide
`AZURE_TEXT_ANALYTICS_ENDPOINT` and `AZURE_TEXT_ANALYTICS_KEY` to enable this
feature.

### Building a mobile app

This project already includes [Capacitor](https://capacitorjs.com/) so the
frontend can be packaged as a native Android or iOS application. To generate the
mobile projects you will need Android Studio (for APKs) and Xcode (for iOS).

Run the following commands from the project root:

```sh
# Install Capacitor's native projects (only once)
npx cap add android
npx cap add ios

# Build the web assets and copy them into the native projects
npm run build
npx cap sync

# Open the projects in their respective IDEs
npx cap open android   # opens Android Studio
npx cap open ios       # opens Xcode
```

From Android Studio or Xcode you can build release versions and generate the APK
or iOS app for distribution.
