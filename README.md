

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

To run the **backend** API server (requires Python and the `whisper` package):

```sh
cd backend
npm install
pip install -r requirements.txt
npm start
```

The server automatically creates an `uploads` folder for media files if it does not exist.

### Environment Variables

Create a `.env` file in the project root (or use your hosting provider's configuration) and define the following variables:

VITE_JWT_SECRET=<your secret key>

The app requires `VITE_JWT_SECRET` for authentication tokens. Media files are stored locally in the `backend/uploads` directory.

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

