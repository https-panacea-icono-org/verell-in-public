import dotenv from 'dotenv';
import { TelegramBot } from './bot';
import { APIServer } from './api';
import { TradeManager } from './utils/tradeManager';
import { TONService } from './utils/ton';

// Load environment variables
dotenv.config();

async function main() {
  // Validate required environment variables
  const requiredEnvVars = ['TELEGRAM_BOT_TOKEN', 'TON_NETWORK'];
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please copy .env.example to .env and fill in the required values');
    process.exit(1);
  }

  // Initialize services
  console.log('Initializing Verell P2P DEX...');

  const tradeManager = new TradeManager();
  console.log('✓ Trade manager initialized');

  const tonEndpoint = process.env.TON_NETWORK === 'mainnet'
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC';

  const tonService = new TONService(
    tonEndpoint,
    process.env.ESCROW_CONTRACT_ADDRESS || ''
  );
  console.log(`✓ TON service initialized (${process.env.TON_NETWORK})`);

  // Start Telegram bot
  const bot = new TelegramBot(
    process.env.TELEGRAM_BOT_TOKEN!,
    tradeManager,
    tonService
  );
  bot.start();
  console.log('✓ Telegram bot started');

  // Start API server
  const port = parseInt(process.env.PORT || '3000');
  const apiServer = new APIServer(tradeManager, tonService, port);
  apiServer.start();
  console.log(`✓ API server started on port ${port}`);

  console.log('\n🚀 Verell P2P DEX is running!');
  console.log('Press Ctrl+C to stop\n');

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    bot.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down gracefully...');
    bot.stop();
    process.exit(0);
  });
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
main().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
