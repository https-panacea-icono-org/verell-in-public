import dotenv from 'dotenv';
import { TelegramBot } from './bot';
import express from 'express';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API endpoints
app.get('/api/orders', (req, res) => {
  res.json({ orders: [] });
});

app.get('/api/trades', (req, res) => {
  res.json({ trades: [] });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

// Start Telegram bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);
bot.start();

console.log('Verell P2P DEX is running!');
console.log(`- API Server: http://localhost:${PORT}`);
console.log('- Telegram Bot: Active');
