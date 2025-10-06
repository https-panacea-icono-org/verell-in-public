# Verell P2P DEX

TON-native non-custodial P2P fiat-to-crypto DEX in Telegram with on-chain escrow.

## 🚀 Features

- **Non-Custodial**: Users maintain full control of their funds
- **On-Chain Escrow**: Smart contract-based escrow on TON blockchain
- **P2P Trading**: Direct peer-to-peer fiat-to-crypto trades
- **Telegram Integration**: Easy-to-use interface via Telegram bot
- **Secure**: Trade disputes resolution and automatic refunds
- **Multi-Currency**: Support for various fiat and cryptocurrencies

## 🏗️ Architecture

### Components

1. **Smart Contract** (`contracts/escrow.fc`)
   - FunC-based escrow contract on TON blockchain
   - Handles fund locking, release, and refunds
   - Supports dispute resolution

2. **Telegram Bot** (`src/bot/`)
   - User-friendly interface via Telegram
   - Commands for buying, selling, and managing trades
   - Real-time trade notifications

3. **API Server** (`src/api/`)
   - REST API for trade and order management
   - Integration with TON blockchain
   - Escrow contract interaction

4. **Trade Manager** (`src/utils/tradeManager.ts`)
   - Order matching and trade lifecycle management
   - In-memory storage (can be replaced with database)

5. **TON Service** (`src/utils/ton.ts`)
   - TON blockchain integration
   - Wallet and contract operations

## 📋 Requirements

- Node.js 18+ and npm
- TON wallet with funds (for contract deployment)
- Telegram Bot Token
- TON development tools (for contract compilation)

## 🔧 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/https-panacea-icono-org/verell-in-public.git
cd verell-in-public

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### Configuration

Edit `.env` file with your settings:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TON_NETWORK=testnet
ESCROW_CONTRACT_ADDRESS=your_contract_address_here
PORT=3000
```

### Build and Run

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed installation and deployment instructions
- [API Documentation](docs/API.md) - REST API reference
- [Smart Contract](contracts/escrow.fc) - Escrow contract source code

## 🤖 Bot Commands

- `/start` - Welcome message and instructions
- `/buy` - Browse available sell orders
- `/sell` - Create a sell order
- `/orders` - View your active orders
- `/trades` - View your active trades
- `/wallet` - Manage your TON wallet
- `/help` - Show help information

## 🔒 Security Features

- **Non-custodial design**: Users control their private keys
- **Smart contract escrow**: Funds secured on-chain
- **Time-locked trades**: Automatic refunds after expiry
- **Dispute resolution**: Built-in dispute handling
- **Payment verification**: Seller confirms payment before release

## 🔄 Trade Flow

1. **Seller creates order**: Lists crypto for sale with price and payment methods
2. **Buyer accepts order**: Creates a trade and funds the escrow
3. **Buyer sends fiat**: Transfers fiat to seller via agreed payment method
4. **Buyer confirms payment**: Marks payment as sent in the system
5. **Seller receives fiat**: Verifies the fiat payment
6. **Seller releases crypto**: Releases funds from escrow to buyer
7. **Trade completed**: Both parties receive their assets

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linter
npm run lint
```

## 🚀 Deployment

### Smart Contract Deployment

1. Compile the contract:
```bash
func -o contracts/escrow.fif -SPA contracts/escrow.fc
```

2. Deploy to testnet/mainnet using TON CLI or SDK

3. Update `.env` with the deployed contract address

### Application Deployment

For production deployment recommendations, see [Setup Guide](docs/SETUP.md).

**Recommended:**
- Use PM2 or Docker for process management
- Set up nginx as reverse proxy
- Enable HTTPS with Let's Encrypt
- Implement database storage for persistence
- Add monitoring and logging

## 🛠️ Technology Stack

- **Blockchain**: TON (The Open Network)
- **Smart Contracts**: FunC
- **Backend**: Node.js, TypeScript
- **Bot Framework**: Telegraf
- **API**: Express.js
- **Testing**: Jest

## 📊 Project Structure

```
verell-in-public/
├── contracts/           # Smart contracts (FunC)
│   └── escrow.fc       # Escrow contract
├── src/
│   ├── bot/            # Telegram bot
│   ├── api/            # REST API server
│   ├── utils/          # Utility functions
│   │   ├── ton.ts      # TON blockchain integration
│   │   └── tradeManager.ts  # Trade management
│   ├── types/          # TypeScript types
│   └── index.ts        # Application entry point
├── tests/              # Test files
├── docs/               # Documentation
├── scripts/            # Deployment scripts
└── package.json        # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [TON Documentation](https://docs.ton.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [FunC Documentation](https://docs.ton.org/develop/func/overview)

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Always test thoroughly on testnet before deploying to mainnet. Never share your private keys or seed phrases.

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/https-panacea-icono-org/verell-in-public/issues)
- Documentation: Check the `docs/` directory

---

Built with ❤️ for the TON ecosystem
