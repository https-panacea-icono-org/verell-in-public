# Vercel Deployment Quick Start

This is a quick reference guide. For detailed instructions, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).

## Prerequisites
- Vercel account
- Vercel CLI installed: `npm install -g vercel@latest`

## Setup Steps (5 minutes)

### 1. Login to Vercel
```bash
vercel login
```

### 2. Link Project
```bash
cd projects/verell-app-frontend
vercel link
```

### 3. Get Credentials
- **VERCEL_TOKEN**: Get from [Vercel Account > Tokens](https://vercel.com/account/tokens)
- **VERCEL_ORG_ID** & **VERCEL_PROJECT_ID**: From `projects/verell-app-frontend/.vercel/project.json`

### 4. Add GitHub Secrets
Go to: `Repository Settings` > `Secrets and variables` > `Actions`

Add these three secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 5. Configure Vercel Environment Variables
Go to: `Vercel Dashboard` > `Your Project` > `Settings` > `Environment Variables`

Add for **Production** environment:

**For TestNet:**
```env
VITE_ENVIRONMENT=production
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud
VITE_ALGOD_NETWORK=testnet
VITE_INDEXER_SERVER=https://testnet-idx.algonode.cloud
VITE_TONCONNECT_MANIFEST_URL=https://your-domain.vercel.app/tonconnect-manifest.json
VITE_TONCONNECT_NETWORK=mainnet
VITE_TONCONNECT_PREFERRED_WALLET=telegram-wallet
```

**For MainNet:**
```env
VITE_ENVIRONMENT=production
VITE_ALGOD_SERVER=https://mainnet-api.algonode.cloud
VITE_ALGOD_NETWORK=mainnet
VITE_INDEXER_SERVER=https://mainnet-idx.algonode.cloud
VITE_TONCONNECT_MANIFEST_URL=https://your-domain.vercel.app/tonconnect-manifest.json
VITE_TONCONNECT_NETWORK=mainnet
VITE_TONCONNECT_PREFERRED_WALLET=telegram-wallet
```

Leave token and port variables empty (not needed for AlgoNode).

### 6. Deploy
Push to `main` branch and the GitHub Actions workflow will:
1. Run tests and linting
2. Bootstrap dependencies
3. Build and deploy to Vercel

## Manual Deployment
```bash
cd projects/verell-app-frontend
vercel deploy --prod
```

## Post-Deployment
After first deployment, update:
1. `VITE_TONCONNECT_MANIFEST_URL` in Vercel with your actual domain
2. `public/tonconnect-manifest.json` URLs with your actual domain

## Troubleshooting

**Build fails?**
- Check that GitHub secrets are set correctly
- Verify the `frontend-prod` environment exists or use repository secrets

**404 on refresh?**
- The `vercel.json` file handles this - it should work automatically

**Environment variables not working?**
- Make sure all `VITE_` prefixed variables are set in Vercel
- Redeploy after adding/changing env vars

## Files Created/Modified
- ✓ `projects/verell-app-frontend/vercel.json` - Vercel configuration
- ✓ `VERCEL_DEPLOYMENT.md` - Detailed setup guide
- ✓ `README.md` - Updated with deployment reference

## What's Already Configured
- ✓ GitHub Actions workflows (`.github/workflows/verell-app-frontend-cd.yaml`)
- ✓ AlgoKit deployment commands (`.algokit.toml`)
- ✓ NPM scripts for Vercel (`package.json`)
- ✓ `.gitignore` excludes `.vercel` folder

---

**Need help?** See the full guide: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
