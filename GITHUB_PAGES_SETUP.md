# GitHub Pages Deployment Instructions

This repository is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

## Initial Setup (One-time configuration)

To enable GitHub Pages for this repository, you need to configure the GitHub Pages settings:

1. Go to your GitHub repository: https://github.com/Aransyah28/uas-big-data
2. Click on **Settings** (gear icon in the top menu)
3. In the left sidebar, scroll down and click on **Pages** (under "Code and automation" section)
4. Under "Build and deployment":
   - **Source**: Select **GitHub Actions** (not "Deploy from a branch")
5. Save the configuration

## How it Works

- The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and deploys the frontend application
- When you push to the `main` branch, the workflow will:
  1. Install dependencies
  2. Build the React application with Vite
  3. Deploy the built files to GitHub Pages
- The site will be available at: https://aransyah28.github.io/uas-big-data/

## Manual Deployment

You can also trigger a manual deployment:

1. Go to the **Actions** tab in your repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click **Run workflow** button
4. Select the branch (usually `main`)
5. Click **Run workflow**

## Configuration Files

- `.github/workflows/deploy.yml` - GitHub Actions workflow for deployment
- `frontend/vite.config.js` - Vite configuration with base path set to `/uas-big-data/`

## Viewing Your Site

After the first successful deployment (which happens automatically after enabling GitHub Pages):
- Your site will be available at: **https://aransyah28.github.io/uas-big-data/**
- You can check the deployment status in the **Actions** tab of your repository

## Notes

- The frontend application is built with React + Vite
- The base path is configured to match the repository name
- Build artifacts (dist folder) are not committed to the repository
- Only the `main` branch triggers automatic deployments
