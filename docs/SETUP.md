# Verell P2P DEX - Setup Guide

## Overview

Verell is a TON-native non-custodial P2P fiat-to-crypto DEX in Telegram with on-chain escrow. This guide will help you set up and deploy your own instance.

## Prerequisites

- Node.js 18+ and npm
- TON wallet with funds (for contract deployment)
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- TON development tools (for contract deployment)

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/https-panacea-icono-org/verell-in-public.git
cd verell-in-public
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `TON_NETWORK`: Use `testnet` for testing, `mainnet` for production
- `TON_API_KEY`: (Optional) TON Center API key for higher limits
- `PORT`: API server port (default: 3000)

## Contract Deployment

### 1. Compile the Smart Contract

The escrow contract is located at `contracts/escrow.fc`. You need to compile it using the TON compiler.

**Install TON tools:**
```bash
npm install -g ton-compiler
```

**Compile the contract:**
```bash
func -o contracts/escrow.fif -SPA contracts/escrow.fc
```

### 2. Deploy to TON Network

**For testnet:**
```bash
# Use TON CLI or SDK to deploy
# Example with ton-cli:
ton-cli deploy contracts/escrow.fif --network testnet
```

**For mainnet:**
```bash
ton-cli deploy contracts/escrow.fif --network mainnet
```

### 3. Save Contract Address

After deployment, save the contract address to `.env`:
```
ESCROW_CONTRACT_ADDRESS=EQYourContractAddress...
```

## Building the Application

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## Running the Application

### Development Mode

```bash
npm run dev
```

This runs the application with ts-node and hot reloading.

### Production Mode

```bash
npm start
```

This runs the compiled JavaScript from the `dist/` directory.

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Linting

Check code style:
```bash
npm run lint
```

## Application Architecture

### Components

1. **Smart Contract** (`contracts/escrow.fc`)
   - On-chain escrow for secure P2P trades
   - Operations: initialize, fund, release, refund, dispute

2. **Telegram Bot** (`src/bot/index.ts`)
   - User interface via Telegram
   - Commands: /buy, /sell, /orders, /trades, /wallet

3. **API Server** (`src/api/index.ts`)
   - REST API for trade management
   - Endpoints for orders, trades, escrow data

4. **Trade Manager** (`src/utils/tradeManager.ts`)
   - In-memory trade and order management
   - Can be replaced with database storage

5. **TON Service** (`src/utils/ton.ts`)
   - TON blockchain integration
   - Contract interaction methods

## Usage

### For Users

1. **Start the bot**: Search for your bot on Telegram and press Start
2. **Connect wallet**: Use `/wallet` command and connect your TON wallet
3. **Create order**: 
   - Buy: `/buy` to browse sell orders
   - Sell: `/sell` to create a sell order
4. **Trade**: Accept an order to start a trade
5. **Complete**: Follow the instructions to complete the trade

### For Administrators

Monitor trades and resolve disputes through the API:

```bash
# Get all active trades
curl http://localhost:3000/api/orders

# Get specific trade details
curl http://localhost:3000/api/trades/{tradeId}

# Check escrow status
curl http://localhost:3000/api/escrow/{escrowAddress}
```

## Security Considerations

1. **Never share private keys**: Users should never share their TON wallet private keys
2. **Use testnet first**: Always test thoroughly on testnet before mainnet deployment
3. **Monitor contracts**: Regularly monitor smart contract interactions
4. **Rate limiting**: Implement rate limiting for production deployments
5. **Secure API**: Add authentication to API endpoints in production

## Troubleshooting

### Bot not responding
- Check `TELEGRAM_BOT_TOKEN` is correct
- Ensure the bot is running: `npm run dev`
- Check bot logs for errors

### Contract deployment fails
- Ensure wallet has sufficient funds
- Verify contract syntax with `func -o test.fif contracts/escrow.fc`
- Check network connectivity

### API errors
- Verify `PORT` is not in use
- Check TON network connectivity
- Review API logs

## Production Deployment

### Recommended Setup

1. **Use a process manager**: PM2, systemd, or Docker
2. **Set up reverse proxy**: nginx or Apache
3. **Enable HTTPS**: Use Let's Encrypt
4. **Add monitoring**: Prometheus, Grafana
5. **Database**: Replace in-memory storage with PostgreSQL/MongoDB
6. **Backup**: Regular backups of trade data
7. **Scaling**: Use Redis for session management

### Example PM2 Configuration

```json
{
  "apps": [{
    "name": "verell-dex",
    "script": "dist/index.js",
    "instances": 1,
    "autorestart": true,
    "watch": false,
    "max_memory_restart": "1G",
    "env": {
      "NODE_ENV": "production"
    }
  }]
}
```

## Support

For issues and questions:
- GitHub Issues: [github.com/https-panacea-icono-org/verell-in-public/issues](https://github.com/https-panacea-icono-org/verell-in-public/issues)
- Documentation: See `docs/` directory

## License

MIT License - see LICENSE file for details
