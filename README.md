# Geopolitical Event Analyzer (Vite Edition)

An application to analyze geopolitical events for a specified country and time period using the Gemini API with Google Search grounding. Built with React, TypeScript, and Vite.

## Features

-   Analyzes geopolitical events for a given country and time period.
-   Uses Google's Gemini API with search grounding for up-to-date information.
-   Displays structured analysis: summary, significance, actors, implications.
-   Shows overall sentiment (Positive, Negative, Neutral) and key themes.
-   Lists web sources used for the analysis.
-   "Copy to Clipboard" functionality for the analysis text.
-   Analysis History: Saves and allows reloading of past analyses (uses browser `localStorage`).

## Project Setup

### Prerequisites

-   Node.js (LTS version recommended)
-   npm (comes with Node.js) or yarn

### 1. Clone the Repository (if applicable)
If you're cloning this from GitHub:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure API Key

This application requires a Google Gemini API key.

**VERY IMPORTANT:**
*   Your API key is sensitive. **NEVER commit it directly into your codebase or into version control.**
*   The application uses Vite, which handles environment variables. It expects the API key to be available as `VITE_API_KEY`.

**Local Development:**
1.  Create a file named `.env` in the root of your project (alongside `package.json`).
2.  Add your API key to this file:
    ```env
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
3.  The `vite.config.ts` is configured to make `process.env.API_KEY` available to your application code, using the value from `VITE_API_KEY`.
4.  **Ensure `.env` is listed in your `.gitignore` file to prevent it from being committed.** (A `.gitignore` file is provided).

## Development Scripts

### Start Development Server
```bash
npm run dev
# or
yarn dev
```
This will start the Vite development server, usually on `http://localhost:3000`.

### Lint Code
```bash
npm run lint
# or
yarn lint
```

## Building for Production

To build the application for production:
```bash
npm run build
# or
yarn build
```
This will create an optimized build in the `dist` folder. The `vite.config.ts` is configured to set the correct base path for GitHub Pages deployment. **Remember to change `GITHUB_REPOSITORY_NAME` in `vite.config.ts` to your actual GitHub repository name.**

### Preview Production Build Locally
After building, you can preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Deployment to GitHub Pages

This project is set up for easy deployment to GitHub Pages.

### 1. Configure `vite.config.ts`
Open `vite.config.ts` and **change the `GITHUB_REPOSITORY_NAME` constant** to your GitHub repository's name. For example, if your repository URL is `https://github.com/your-username/my-geo-app`, then set `GITHUB_REPOSITORY_NAME = 'my-geo-app';`.

### 2. Set up GitHub Repository Secret
For the deployed application to access the Gemini API, you need to provide the API key securely.
1.  Go to your GitHub repository.
2.  Navigate to `Settings` > `Secrets and variables` > `Actions`.
3.  Click `New repository secret`.
4.  Name the secret `VITE_API_KEY`.
5.  Paste your actual Gemini API key into the "Secret" field.
6.  Click `Add secret`.

### 3. Deploy using `gh-pages` (Manual or CI)

**Option A: Manual Deploy Script**
The `package.json` includes a script to deploy using the `gh-pages` package.
1.  Ensure you have committed and pushed all your changes to GitHub.
2.  Run the build command: `npm run build`
3.  Run the deploy command:
    ```bash
    npm run deploy
    ```
    This will build your project and push the contents of the `dist` folder to a `gh-pages` branch on your repository.

**Option B: Using GitHub Actions (Recommended for automated deployment)**

1.  Create a workflow file in your repository: `.github/workflows/deploy.yml`
    ```yaml
    name: Deploy to GitHub Pages

    on:
      push:
        branches:
          - main # Or your default branch

    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout repository
            uses: actions/checkout@v4

          - name: Set up Node.js
            uses: actions/setup-node@v4
            with:
              node-version: '18' # Or your preferred LTS version
              cache: 'npm'

          - name: Install dependencies
            run: npm install

          - name: Build project
            run: npm run build
            env:
              VITE_API_KEY: ${{ secrets.VITE_API_KEY }} # Use the secret

          - name: Deploy to GitHub Pages
            uses: peaceiris/actions-gh-pages@v4
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              publish_dir: ./dist
    ```

2.  Commit and push this workflow file to your repository.
3.  Now, every time you push to your `main` branch, GitHub Actions will automatically build and deploy your application to GitHub Pages.

### 4. Configure GitHub Pages Source
1.  In your GitHub repository, go to `Settings` > `Pages`.
2.  Under "Build and deployment", for "Source", select `Deploy from a branch`.
3.  For "Branch", select `gh-pages` and the `/ (root)` folder.
4.  Click `Save`.

It might take a few minutes for your site to become live at `https://your-username.github.io/your-repo-name/`.

---

This setup provides a robust development and deployment workflow for your Geopolitical Event Analyzer. Remember to manage your API key securely.
