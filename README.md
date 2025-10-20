# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7ce6c920-304f-4ec8-857a-ec9a6e58b3dc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7ce6c920-304f-4ec8-857a-ec9a6e58b3dc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

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

## Connecting Google Sheets data

The admin dashboard can now pull live insights from a Google Sheet instead of Kobo Collect. Provide the following environment variables (for example by creating a `.env` file at the project root) before starting the app:

```bash
VITE_GOOGLE_SHEETS_ID=<your-sheet-id>
VITE_GOOGLE_SHEETS_API_KEY=<google-cloud-api-key>
VITE_GOOGLE_SHEETS_RANGE="Sheet1!A1:Z"
```

- `VITE_GOOGLE_SHEETS_ID` is the ID from your sheet's URL (the value between `/d/` and `/edit`).
- `VITE_GOOGLE_SHEETS_API_KEY` must have access to the Google Sheets API.
- `VITE_GOOGLE_SHEETS_RANGE` is optional and defaults to `Sheet1!A1:Z`.

The first row of the sheet should contain headers such as `Date`, `Product`, `Category`, `Brand`, and `Points`. The dashboard will automatically normalise header names and build analytics based on the rows beneath the header.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7ce6c920-304f-4ec8-857a-ec9a6e58b3dc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
