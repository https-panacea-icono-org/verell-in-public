# Verell P2P DEX - Quick Start Guide

This guide will help you get Verell P2P DEX up and running quickly for development and testing.

## Prerequisites

Make sure you have installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **TON wallet** - [TonKeeper](https://tonkeeper.com/) or [TonHub](https://tonhub.com/)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/https-panacea-icono-org/verell-in-public.git
cd verell-in-public

# Install dependencies
npm install
```

### 2. Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your favorite editor
nano .env  # or vim, code, etc.
```

Add your bot token:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TON_NETWORK=testnet
PORT=3000
```

### 4. Build the Project

```bash
npm run build
```

### 5. Run in Development Mode

```bash
npm run dev
```

You should see:
```
✓ Trade manager initialized
✓ TON service initialized (testnet)
✓ Telegram bot started
✓ API server started on port 3000

🚀 Verell P2P DEX is running!
```

### 6. Test Your Bot

1. Open Telegram
2. Search for your bot by username
3. Press **Start**
4. You should see the welcome message!

## Basic Usage

### For Sellers

1. Send `/sell` to create a sell order
2. Follow the format: `/createsell <amount> <crypto> <price> <currency> <payment_method>`
3. Example: `/createsell 10 TON 2.5 USD Bank Transfer`

### For Buyers

1. Send `/buy` to see available orders
2. Note the order ID
3. Use `/accept <order_id>` to start a trade

### Managing Trades

- `/orders` - View your active orders
- `/trades` - View your active trades
- `/wallet` - Manage your TON wallet

## Testing the API

The REST API runs on port 3000 by default. You can test it with curl:

```bash
# Health check
curl http://localhost:3000/health

# Get active orders
curl http://localhost:3000/api/orders

# Create an order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 12345,
    "type": "sell",
    "currency": "USD",
    "cryptoCurrency": "TON",
    "amount": 100,
    "price": 2.5,
    "paymentMethods": ["Bank Transfer"]
  }'
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linter
npm run lint
```

## Smart Contract Deployment

To deploy the escrow smart contract:

1. **Install TON tools:**
   ```bash
   npm install -g ton-compiler
   ```

2. **Compile the contract:**
   ```bash
   func -o contracts/escrow.fif -SPA contracts/escrow.fc
   ```

3. **Deploy to testnet:**
   - Use [TON Wallet](https://wallet.ton.org/) or TON CLI
   - Deploy the compiled contract
   - Save the contract address

4. **Update .env:**
   ```env
   ESCROW_CONTRACT_ADDRESS=EQYourContractAddress...
   ```

## Common Issues

### Bot not responding

**Problem:** Bot doesn't reply to messages

**Solutions:**
- Check if `TELEGRAM_BOT_TOKEN` is correct
- Ensure the bot process is running (`npm run dev`)
- Check console for error messages
- Verify bot is not being used elsewhere

### Port already in use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
- Change `PORT` in `.env` to a different port (e.g., 3001)
- Or kill the process using port 3000:
  ```bash
  # Find process
  lsof -i :3000
  # Kill it
  kill -9 <PID>
  ```

### TON Network errors

**Problem:** Errors connecting to TON network

**Solutions:**
- Check your internet connection
- Verify `TON_NETWORK` is set to `testnet` or `mainnet`
- Try using a different TON endpoint
- Check TON network status

## Development Tips

### Hot Reloading

Use `npm run dev` for development. It will reload automatically when you change files (though you may need to restart for some changes).

### Debugging

Add debug logs:
```typescript
console.log('Debug info:', variable);
```

View logs in the terminal where you ran `npm run dev`.

### Database Integration

The current implementation uses in-memory storage. For production:

1. Install a database (PostgreSQL, MongoDB, etc.)
2. Replace `TradeManager` in-memory maps with database queries
3. Add proper data persistence

### Adding Features

The codebase is modular:
- **Bot commands**: Edit `src/bot/index.ts`
- **API endpoints**: Edit `src/api/index.ts`
- **Trade logic**: Edit `src/utils/tradeManager.ts`
- **Blockchain**: Edit `src/utils/ton.ts`

## Next Steps

1. **Test thoroughly** - Try creating orders and trades
2. **Deploy contract** - Deploy the escrow contract to testnet
3. **Add wallet** - Connect your TON wallet
4. **Complete a trade** - Test the full trade flow
5. **Go to production** - Deploy to mainnet when ready

## Resources

- [Full Setup Guide](docs/SETUP.md) - Detailed installation instructions
- [API Documentation](docs/API.md) - REST API reference
- [TON Documentation](https://docs.ton.org/) - Learn about TON blockchain
- [Telegram Bot API](https://core.telegram.org/bots/api) - Bot development

## Getting Help

- Check the [Issues](https://github.com/https-panacea-icono-org/verell-in-public/issues) page
- Read the documentation in the `docs/` folder
- Review the code comments

## Security Reminder

⚠️ **Important:**
- This is for development/testing on testnet
- Never share your private keys or seed phrases
- Test thoroughly before using real funds
- Always use testnet first

---

Happy trading! 🚀
