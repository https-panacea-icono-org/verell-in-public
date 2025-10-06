# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Telegram account
- Basic understanding of TON blockchain

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

   Edit `.env` and add your settings:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
   TELEGRAM_BOT_USERNAME=your_bot_username
   TON_NETWORK=testnet
   PORT=3000
   NODE_ENV=development
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests (optional)**
   ```bash
   npm test
   ```

6. **Start the application**
   ```bash
   npm start
   ```

## Creating Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow instructions to choose a name and username
4. Copy the bot token provided
5. Paste the token in your `.env` file

## Testing the Bot

1. Open Telegram and search for your bot by username
2. Click "Start" to begin interaction
3. Try basic commands:
   - `/start` - See welcome message
   - `/help` - View available commands
   - `/orders` - Browse orders (will be empty initially)

## Creating Your First Trade

### As a Seller (selling TON for fiat)

```
/sell 10 USD 2.5 PayPal
```

This creates an order to sell 10 TON at $2.5 per TON, accepting PayPal.

### As a Buyer (buying TON with fiat)

```
/buy 100 USD 2.5 Bank Transfer
```

This creates an order to buy $100 worth of TON at $2.5 per TON, paying via Bank Transfer.

## Trade Flow

1. **Create Order** - Use `/buy` or `/sell` command
2. **Match Order** - Wait for counter-party or accept existing order
3. **Fund Escrow** - Buyer sends TON to escrow contract
4. **Fiat Payment** - Seller provides payment details, buyer sends fiat
5. **Confirm Payment** - Seller confirms fiat receipt in bot
6. **Release Funds** - Buyer releases TON from escrow to seller

## Development

### Run in development mode
```bash
npm run dev
```

### Watch for changes
```bash
npm run build -- --watch
```

### Run linter
```bash
npm run lint
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## Project Structure

```
verell-in-public/
├── contracts/          # Smart contracts (FunC & Tact)
├── src/
│   ├── bot/           # Telegram bot implementation
│   ├── services/      # Core business logic
│   ├── types/         # TypeScript types
│   └── utils/         # Helper functions
├── docs/              # Documentation
└── dist/              # Compiled JavaScript (after build)
```

## Common Issues

### Bot doesn't respond
- Check bot token is correct in `.env`
- Ensure bot is running (`npm start`)
- Check console for errors

### Build errors
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Run `npm run build`

### Tests fail
- Ensure all dependencies are installed
- Check Node.js version (18+)
- Run `npm install ts-jest`

## Next Steps

- Read [Architecture Documentation](docs/ARCHITECTURE.md)
- Check [API Documentation](docs/API.md)
- Review [Security Model](docs/SECURITY.md)
- See [Deployment Guide](docs/DEPLOYMENT.md)

## Support

- GitHub Issues: Report bugs or request features
- Documentation: Check docs/ folder
- Contributing: See CONTRIBUTING.md

## Safety Tips

⚠️ **Important Security Notes:**

- Never share your bot token
- Never share private keys
- Start with testnet for learning
- Test with small amounts first
- Always verify payment details
- Use escrow for all trades

## Resources

- [TON Documentation](https://ton.org/docs)
- [Telegraf Documentation](https://telegraf.js.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

Happy trading! 🚀
