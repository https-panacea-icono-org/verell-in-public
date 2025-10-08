# Vercel Deployment Guide for verell-app-frontend

This guide will help you set up continuous deployment to Vercel for the verell-app-frontend application.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- The [Vercel CLI](https://vercel.com/cli) installed
- Access to your GitHub repository settings to add secrets

## Initial Setup Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel@latest
```

### 2. Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### 3. Link Your Project to Vercel

Navigate to the frontend project directory:

```bash
cd projects/verell-app-frontend
```

Create a new Vercel project:

```bash
vercel link
```

This will:
- Prompt you to select your Vercel scope (personal account or team)
- Ask if you want to link to an existing project or create a new one
- Create a `.vercel` folder with your project configuration

### 4. Get Your Vercel Credentials

After linking, you need to retrieve three pieces of information:

1. **VERCEL_TOKEN**: Your Vercel API token
   - Go to [Vercel Account Settings > Tokens](https://vercel.com/account/tokens)
   - Click "Create Token"
   - Give it a name like "GitHub Actions Deploy"
   - Set appropriate scope (recommended: full account access)
   - Copy the token (you'll only see it once!)

2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**: From your project configuration
   - Open the file `projects/verell-app-frontend/.vercel/project.json`
   - Copy the `orgId` value (this is your `VERCEL_ORG_ID`)
   - Copy the `projectId` value (this is your `VERCEL_PROJECT_ID`)

### 5. Add GitHub Secrets

Go to your GitHub repository settings:

1. Navigate to: `Settings` > `Secrets and variables` > `Actions`
2. Click "New repository secret"
3. Add the following three secrets:

   - **Name:** `VERCEL_TOKEN`
     - **Value:** (paste your Vercel API token)
   
   - **Name:** `VERCEL_ORG_ID`
     - **Value:** (paste the orgId from project.json)
   
   - **Name:** `VERCEL_PROJECT_ID`
     - **Value:** (paste the projectId from project.json)

### 6. Configure Environment Variables in Vercel

The application requires several environment variables to be set in Vercel. You can set these in two ways:

#### Option A: Via Vercel Dashboard (Recommended for first setup)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to `Settings` > `Environment Variables`
4. Add the following variables for the `Production` environment:

```env
# Algorand Network Configuration (TestNet example)
VITE_ENVIRONMENT=production
VITE_ALGOD_TOKEN=
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud
VITE_ALGOD_PORT=
VITE_ALGOD_NETWORK=testnet

VITE_INDEXER_TOKEN=
VITE_INDEXER_SERVER=https://testnet-idx.algonode.cloud
VITE_INDEXER_PORT=

# TON Connect Configuration
VITE_TONCONNECT_MANIFEST_URL=https://your-domain.vercel.app/tonconnect-manifest.json
VITE_TONCONNECT_NETWORK=mainnet
VITE_TONCONNECT_PREFERRED_WALLET=telegram-wallet
```

**For MainNet:**
```env
VITE_ENVIRONMENT=production
VITE_ALGOD_TOKEN=
VITE_ALGOD_SERVER=https://mainnet-api.algonode.cloud
VITE_ALGOD_PORT=
VITE_ALGOD_NETWORK=mainnet

VITE_INDEXER_TOKEN=
VITE_INDEXER_SERVER=https://mainnet-idx.algonode.cloud
VITE_INDEXER_PORT=

VITE_TONCONNECT_MANIFEST_URL=https://your-domain.vercel.app/tonconnect-manifest.json
VITE_TONCONNECT_NETWORK=mainnet
VITE_TONCONNECT_PREFERRED_WALLET=telegram-wallet
```

#### Option B: Via .env File Upload

1. Create a `.env` file with your production environment variables
2. Go to your Vercel project settings
3. Navigate to `Environment Variables`
4. Drag and drop your `.env` file to upload all variables at once

**Important:** Replace `your-domain.vercel.app` with your actual Vercel deployment URL after your first deployment.

### 7. Trigger Deployment

The deployment will automatically trigger when you:
- Push to the `main` branch
- The GitHub Actions workflow will:
  1. Run validation checks (verell-app-frontend-ci.yaml)
  2. If validation passes, run deployment (verell-app-frontend-cd.yaml)
  3. Bootstrap dependencies (including smart contract artifacts)
  4. Build the application
  5. Deploy to Vercel

## Manual Deployment (Optional)

If you want to deploy manually:

```bash
cd projects/verell-app-frontend

# Pull latest Vercel configuration
vercel pull --yes --environment=production

# Build the project
npm run build

# Deploy to production
vercel deploy --prod
```

## Deployment Architecture

The deployment process follows this flow:

1. **GitHub Actions Trigger**: Push to `main` branch
2. **CI Workflow**: Runs linting, tests, and builds
3. **CD Workflow**: If CI passes, runs deployment
   - Installs Vercel CLI
   - Pulls Vercel project configuration
   - Runs `vercel build --prod` (uses `vercel.json` config)
   - Deploys with `vercel deploy --prebuilt --prod`

## Configuration Files

- **`vercel.json`**: Vercel project configuration
  - Defines build command: `npm run build`
  - Sets output directory: `dist`
  - Configures SPA routing (all routes → index.html)
  - Framework detection: `vite`

- **`.algokit.toml`**: AlgoKit project configuration
  - Defines `ci-deploy-vercel` command
  - Orchestrates Vercel CLI installation and deployment

- **`package.json`**: NPM scripts for Vercel
  - `ci:vercel:pull`: Pull project configuration
  - `ci:vercel:build`: Build for Vercel
  - `ci:vercel:deploy`: Complete deployment pipeline

## Troubleshooting

### Build Fails: "algokit: not found"
- Ensure the CI workflow runs before CD workflow
- The bootstrap step installs AlgoKit and generates smart contract artifacts

### Environment Variables Not Working
- Make sure all `VITE_` prefixed variables are set in Vercel
- Vercel only includes environment variables during build time for Vite apps
- After adding/changing env vars, redeploy the project

### 404 Errors on Refresh
- Verify `vercel.json` has the rewrites configuration
- This ensures all routes are handled by the SPA

### Deployment Succeeds but Site Not Working
- Check the Vercel deployment logs for runtime errors
- Verify environment variables are correctly set
- Check browser console for API connection issues

## Updating the TON Connect Manifest

After your first deployment, update the TON Connect configuration:

1. Note your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Update `projects/verell-app-frontend/public/tonconnect-manifest.json`:
   - Replace `"url": "https://verell.app"` with your actual URL
   - Update `iconUrl`, `termsOfUseUrl`, and `privacyPolicyUrl` accordingly
3. Update the `VITE_TONCONNECT_MANIFEST_URL` environment variable in Vercel
4. Commit and push changes to trigger a new deployment

## Monitoring

- View deployment logs in the [Vercel Dashboard](https://vercel.com/dashboard)
- Monitor GitHub Actions workflows in your repository's Actions tab
- Check Vercel analytics for traffic and performance metrics

## Security Notes

- Never commit the `.vercel` folder to git (already in `.gitignore`)
- Keep your `VERCEL_TOKEN` secret and rotate it periodically
- Use environment-specific configurations (don't expose testnet/mainnet keys)
- The `.env` file is gitignored - never commit actual environment values

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [AlgoKit Documentation](https://github.com/algorandfoundation/algokit-cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
