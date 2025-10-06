# Verell - P2P Crypto Exchange

> TON-native non-custodial P2P fiat-to-crypto DEX in Telegram with on-chain escrow.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TON](https://img.shields.io/badge/TON-Blockchain-0088cc)](https://ton.org)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-blue)](https://telegram.org)

## 🚀 Features

- **🔒 Non-Custodial**: Users maintain full control of their funds
- **⛓️ On-Chain Escrow**: Smart contract-based escrow for secure trades
- **💱 P2P Trading**: Direct trades between users without intermediaries
- **💬 Telegram Native**: Seamless trading experience within Telegram
- **⚡ Fast Settlement**: Quick trade execution on TON blockchain
- **🌍 Multi-Currency**: Support for multiple fiat currencies (USD, EUR, GBP, RUB)
- **🛡️ Dispute Resolution**: Built-in dispute handling mechanism
- **📊 Order Book**: Real-time buy and sell order matching

## 🏗️ Architecture

```
┌─────────────────┐
│  Telegram User  │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Telegram Bot   │
│  (Node.js/TS)   │
└────────┬────────┘
         │
         v
┌─────────────────┐         ┌──────────────────┐
│  Order Book &   │◄────────►│  TON Blockchain  │
│  Trade Manager  │         │  (Smart Contracts)│
└─────────────────┘         └──────────────────┘
```

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- TON Wallet (Tonkeeper, Tonhub, or OpenMask)

## ⚙️ Installation

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
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   npm start
   ```

## 🔧 Configuration

Create a `.env` file with the following variables:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username

# TON Network Configuration
TON_NETWORK=testnet
TON_API_KEY=your_ton_api_key

# Application Configuration
PORT=3000
NODE_ENV=development

# Admin Configuration
ADMIN_CHAT_IDS=123456789,987654321
```

## 🎮 Usage

### For Users

1. **Start the bot**: Search for your bot on Telegram and click "Start"
2. **Create an order**: Use `/buy` or `/sell` commands
   ```
   /buy 100 USD 2.5 PayPal
   /sell 50 USD 2.5 Bank Transfer
   ```
3. **View orders**: Use `/orders` to see available trades
4. **Manage trades**: Use `/mytrades` to track your active trades
5. **Connect wallet**: Use `/wallet` to link your TON wallet

### Telegram Commands

- `/start` - Initialize bot and see welcome message
- `/help` - Display help information
- `/buy <amount> <currency> <price> <method>` - Create buy order
- `/sell <amount> <currency> <price> <method>` - Create sell order
- `/orders` - Browse available orders
- `/mytrades` - View your active trades
- `/wallet` - Manage wallet connection
- `/cancel` - Cancel order or trade

### Trade Flow

1. **Create or accept order** - Buyer/seller creates or accepts an order
2. **Fund escrow** - Buyer sends TON to smart contract escrow
3. **Send fiat payment** - Seller provides payment details, buyer sends fiat
4. **Confirm payment** - Seller confirms fiat receipt
5. **Release funds** - Buyer releases TON from escrow to seller
6. **Complete trade** - Trade marked as completed

## 🧪 Development

### Run in development mode
```bash
npm run dev
```

### Build TypeScript
```bash
npm run build
```

### Run tests
```bash
npm test
```

### Lint code
```bash
npm run lint
```

## 📁 Project Structure

```
verell-in-public/
├── contracts/          # Smart contracts (FunC & Tact)
│   ├── escrow.fc      # FunC implementation
│   └── escrow.tact    # Tact implementation
├── src/
│   ├── bot/           # Telegram bot implementation
│   │   └── index.ts
│   ├── services/      # Core business logic
│   │   ├── trading.ts # Order book & trade manager
│   │   └── blockchain.ts # TON blockchain service
│   ├── types/         # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/         # Helper functions
│   │   └── helpers.ts
│   └── index.ts       # Application entry point
├── docs/              # Documentation
│   ├── ARCHITECTURE.md
│   └── API.md
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Smart Contracts

### Escrow Contract

The escrow smart contract is implemented in both FunC and Tact for maximum compatibility.

**Features:**
- Holds buyer funds during trade
- Time-based automatic refunds
- Support for disputes
- On-chain state verification

**Operations:**
- Initialize escrow with buyer, seller, and timeout
- Release funds to seller (buyer approval)
- Cancel and refund to buyer (timeout or buyer request)
- Open dispute (buyer or seller)

See [contracts/escrow.fc](contracts/escrow.fc) and [contracts/escrow.tact](contracts/escrow.tact) for implementation details.

## 📚 Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md) - System design and components
- [API Documentation](docs/API.md) - REST API and smart contract interfaces

## 🛡️ Security

- **Non-custodial design**: Users control their private keys
- **Smart contract escrow**: Funds locked on-chain during trades
- **Time-based protection**: Automatic refunds prevent indefinite locks
- **Rate limiting**: Protection against spam and abuse
- **Dispute mechanism**: Fair resolution for conflicts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TON Blockchain](https://ton.org) - The Open Network
- [Telegraf](https://telegraf.js.org) - Telegram bot framework
- [@ton/ton](https://github.com/ton-community/ton) - TON SDK

## 📞 Support

- Telegram: [@VerellSupport](https://t.me/VerellSupport)
- Issues: [GitHub Issues](https://github.com/https-panacea-icono-org/verell-in-public/issues)

## 🗺️ Roadmap

- [x] Basic P2P trading functionality
- [x] Escrow smart contracts
- [x] Telegram bot interface
- [ ] Persistent database storage
- [ ] User reputation system
- [ ] Advanced order matching
- [ ] Multi-language support
- [ ] Mobile app integration
- [ ] Analytics dashboard
- [ ] Decentralized dispute resolution

---

Built with ❤️ for the TON ecosystem