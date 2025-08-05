# Backend API

This directory contains a minimal Express server for the Snack Track Insight application.

## Setup

From the project root directory:

```sh
npm install
npm start
```

The server will start on the port specified by the `PORT` environment variable (defaults to `4000`).

## Transcription Service

The backend uses the Hugging Face Inference API for audio transcription. Specifically, it sends audio files to a speech-to-text model and receives the transcribed text.

To use this service, you need a Hugging Face API token.

### Getting a Hugging Face API Token

1.  Create a free account on [Hugging Face](https://huggingface.co/join).
2.  Navigate to your profile settings: `https://huggingface.co/settings/tokens`.
3.  Generate a new **User Access Token**. A `read`-only token is sufficient for this service.
4.  Copy the token. You will use this for the `HF_TOKEN` environment variable.

## Environment Variables

For local development, create a `.env` file in the project root. In a production environment (like Azure App Service), set these as environment variables.

### Required Variables

-   `DB_HOST`: The hostname of your PostgreSQL database.
-   `DB_PORT`: The port of your PostgreSQL database.
-   `DB_USER`: The username for your PostgreSQL database.
-   `DB_PASSWORD`: The password for your PostgreSQL database.
-   `DB_NAME`: The name of your PostgreSQL database.
-   `HF_TOKEN`: Your Hugging Face API token.

### Optional Variables

-   `PORT`: The port for the backend server to listen on (defaults to `4000`).
-   `HF_MODEL`: The Hugging Face model to use for transcription (defaults to `openai/whisper-large-v3`). You can specify any other compatible model.
-   `AZURE_STORAGE_CONNECTION_STRING`: If you want to store uploaded files in Azure Blob Storage, provide the connection string here.
-   `AZURE_AUDIO_CONTAINER`: The name of the Azure Blob Storage container for audio files.
-   `AZURE_MEDIA_CONTAINER`: The name of the Azure Blob Storage container for media files.
-   `CORS_ORIGIN`: A comma-separated list of allowed origins for CORS requests.

Example `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=snackuser
DB_PASSWORD=snackpass
DB_NAME=snacktrack
PORT=4000
HF_TOKEN=your_hugging_face_token_here
# HF_MODEL=openai/whisper-base
```

The server automatically loads variables from the `.env` file during local development. When deployed to Azure, it will use the environment variables configured in the App Settings.
