

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
```

To run the **backend** API server:

```sh
cd backend
npm install
npm start
```

### Environment Variables

Create a `.env` file in the project root (or use your hosting provider's configuration) and define the following variables:

```
VITE_JWT_SECRET=<your secret key>
VITE_AZURE_STORAGE_ACCOUNT=<your storage account>
VITE_AZURE_STORAGE_CONTAINER=<your container name>
VITE_AZURE_STORAGE_SAS=<your SAS token>
VITE_FIREBASE_API_KEY=<firebase api key>
VITE_FIREBASE_AUTH_DOMAIN=<firebase auth domain>
VITE_FIREBASE_PROJECT_ID=<firebase project id>
VITE_FIREBASE_MESSAGING_SENDER_ID=<firebase sender id>
VITE_FIREBASE_APP_ID=<firebase app id>
VITE_FIREBASE_VAPID_KEY=<public vapid key>
FIREBASE_SERVICE_ACCOUNT=<service account JSON>
```

The app requires `VITE_JWT_SECRET` for authentication tokens. Azure Storage variables are optional but enable media uploads if provided.

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

