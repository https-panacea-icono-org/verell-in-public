import { Telegraf, Context, Markup } from 'telegraf';
import { TradeManager } from '../utils/tradeManager';
import { TONService } from '../utils/ton';
import { OrderType, TradeStatus } from '../types';

export class TelegramBot {
  private bot: Telegraf;
  private tradeManager: TradeManager;
  private tonService: TONService;
  private userSessions: Map<number, any> = new Map();

  constructor(token: string, tradeManager: TradeManager, tonService: TONService) {
    this.bot = new Telegraf(token);
    this.tradeManager = tradeManager;
    this.tonService = tonService;
    this.setupHandlers();
  }

  private setupHandlers() {
    // Start command
    this.bot.command('start', (ctx) => this.handleStart(ctx));
    
    // Main menu commands
    this.bot.command('buy', (ctx) => this.handleBuy(ctx));
    this.bot.command('sell', (ctx) => this.handleSell(ctx));
    this.bot.command('orders', (ctx) => this.handleOrders(ctx));
    this.bot.command('trades', (ctx) => this.handleTrades(ctx));
    this.bot.command('wallet', (ctx) => this.handleWallet(ctx));
    this.bot.command('help', (ctx) => this.handleHelp(ctx));

    // Callback queries for inline buttons
    this.bot.on('callback_query', (ctx) => this.handleCallback(ctx));

    // Text messages
    this.bot.on('text', (ctx) => this.handleText(ctx));
  }

  private async handleStart(ctx: Context) {
    const welcomeMessage = `
🚀 Welcome to Verell P2P DEX!

TON-native non-custodial P2P exchange with on-chain escrow.

**Main Commands:**
/buy - Browse sell orders and buy crypto
/sell - Create sell order for your crypto
/orders - View active orders
/trades - View your active trades
/wallet - Manage your TON wallet
/help - Show help information

Your trades are secured by smart contract escrow on TON blockchain.
    `;

    await ctx.reply(welcomeMessage, Markup.keyboard([
      ['💰 Buy Crypto', '💵 Sell Crypto'],
      ['📋 My Orders', '🔄 My Trades'],
      ['👛 Wallet', '❓ Help']
    ]).resize());
  }

  private async handleBuy(ctx: Context) {
    const sellOrders = this.tradeManager.getActiveOrders(OrderType.SELL);
    
    if (sellOrders.length === 0) {
      await ctx.reply('No sell orders available at the moment. Please check back later.');
      return;
    }

    let message = '💰 **Available Sell Orders:**\n\n';
    
    sellOrders.slice(0, 10).forEach((order, index) => {
      message += `${index + 1}. ${order.cryptoAmount} ${order.cryptoCurrency} for ${order.amount} ${order.currency}\n`;
      message += `   Price: ${order.price} ${order.currency}/${order.cryptoCurrency}\n`;
      message += `   Payment: ${order.paymentMethods.join(', ')}\n`;
      message += `   Order ID: \`${order.id}\`\n\n`;
    });

    message += '\nTo accept an order, use: /accept <order_id>';
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  private async handleSell(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    await ctx.reply(
      '💵 Create a Sell Order\n\n' +
      'Please provide the following information:\n' +
      '1. Amount of crypto to sell (e.g., 1.5 TON)\n' +
      '2. Price per unit in your fiat currency\n' +
      '3. Fiat currency (e.g., USD, EUR)\n' +
      '4. Payment methods (e.g., Bank Transfer, PayPal)\n\n' +
      'Format: /createsell <amount> <crypto> <price> <currency> <payment_methods>\n' +
      'Example: /createsell 10 TON 2.5 USD Bank Transfer'
    );
  }

  private async handleOrders(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const allOrders = Array.from(this.tradeManager.getActiveOrders());
    const userOrders = allOrders.filter(order => order.userId === userId);

    if (userOrders.length === 0) {
      await ctx.reply('You have no active orders.');
      return;
    }

    let message = '📋 **Your Active Orders:**\n\n';
    
    userOrders.forEach((order, index) => {
      message += `${index + 1}. ${order.type.toUpperCase()}: ${order.amount} ${order.currency} ⇄ ${order.cryptoCurrency}\n`;
      message += `   Price: ${order.price} ${order.currency}\n`;
      message += `   Status: ${order.status}\n`;
      message += `   ID: \`${order.id}\`\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  private async handleTrades(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const trades = this.tradeManager.getUserTrades(userId);

    if (trades.length === 0) {
      await ctx.reply('You have no active trades.');
      return;
    }

    let message = '🔄 **Your Active Trades:**\n\n';
    
    trades.forEach((trade, index) => {
      const isBuyer = trade.buyerId === userId;
      const role = isBuyer ? 'Buyer' : 'Seller';
      
      message += `${index + 1}. ${role} - ${trade.cryptoAmount} ${trade.cryptoCurrency}\n`;
      message += `   Amount: ${trade.amount} ${trade.currency}\n`;
      message += `   Status: ${trade.status}\n`;
      message += `   Trade ID: \`${trade.id}\`\n\n`;
    });

    message += '\nUse /tradedetails <trade_id> to see full trade details';
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  private async handleWallet(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    await ctx.reply(
      '👛 **Wallet Management**\n\n' +
      'Connect your TON wallet to start trading:\n' +
      '/connectwallet <your_ton_address>\n\n' +
      'Check balance:\n' +
      '/balance\n\n' +
      '⚠️ Never share your private keys or seed phrase!'
    );
  }

  private async handleHelp(ctx: Context) {
    const helpMessage = `
❓ **Verell P2P DEX Help**

**How it works:**
1. Buyers browse sell orders or create buy orders
2. Sellers create sell orders with their terms
3. When matched, funds are locked in smart contract escrow
4. Buyer sends fiat payment to seller
5. Seller confirms payment and releases crypto
6. Funds are automatically transferred from escrow

**Security:**
✅ Non-custodial - you control your funds
✅ On-chain escrow - smart contract protection
✅ Dispute resolution available
✅ Trade expiry for safety

**Commands:**
/buy - Buy cryptocurrency
/sell - Sell cryptocurrency
/orders - View your orders
/trades - View active trades
/wallet - Wallet management
/help - This help message

**Support:** Contact @admin for assistance
    `;

    await ctx.reply(helpMessage);
  }

  private async handleCallback(ctx: Context) {
    // Handle inline button callbacks
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;
    
    const data = ctx.callbackQuery.data;
    const userId = ctx.from?.id;
    if (!userId) return;

    // Parse callback data and handle accordingly
    const [action, ...params] = data.split(':');

    switch (action) {
      case 'accept_order':
        await this.handleAcceptOrder(ctx, params[0]);
        break;
      case 'confirm_payment':
        await this.handleConfirmPayment(ctx, params[0]);
        break;
      case 'release_funds':
        await this.handleReleaseFunds(ctx, params[0]);
        break;
      case 'dispute':
        await this.handleDispute(ctx, params[0]);
        break;
    }

    await ctx.answerCbQuery();
  }

  private async handleAcceptOrder(ctx: Context, orderId: string) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const order = this.tradeManager.getOrder(orderId);
    if (!order) {
      await ctx.reply('Order not found or no longer available.');
      return;
    }

    // Create trade
    const trade = this.tradeManager.createTrade(
      orderId,
      userId,
      order.userId,
      order.amount,
      order.currency,
      order.amount / order.price,
      order.cryptoCurrency,
      order.price,
      order.paymentMethods[0]
    );

    if (!trade) {
      await ctx.reply('Failed to create trade. Please try again.');
      return;
    }

    await ctx.reply(
      `✅ Trade created!\n\n` +
      `Trade ID: \`${trade.id}\`\n` +
      `Amount: ${trade.cryptoAmount} ${trade.cryptoCurrency}\n` +
      `Price: ${trade.amount} ${trade.currency}\n\n` +
      `Please fund the escrow to proceed.`,
      { parse_mode: 'Markdown' }
    );
  }

  private async handleConfirmPayment(ctx: Context, tradeId: string) {
    const trade = this.tradeManager.getTrade(tradeId);
    if (!trade) {
      await ctx.reply('Trade not found.');
      return;
    }

    this.tradeManager.updateTradeStatus(tradeId, TradeStatus.PAYMENT_SENT);
    
    await ctx.reply(
      '✅ Payment confirmation sent to seller.\n' +
      'Waiting for seller to release funds from escrow.'
    );
  }

  private async handleReleaseFunds(ctx: Context, tradeId: string) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const trade = this.tradeManager.getTrade(tradeId);
    if (!trade || trade.sellerId !== userId) {
      await ctx.reply('Invalid trade or you are not the seller.');
      return;
    }

    this.tradeManager.updateTradeStatus(tradeId, TradeStatus.COMPLETED);
    
    await ctx.reply(
      '✅ Funds released successfully!\n' +
      'Trade completed. Thank you for using Verell DEX!'
    );
  }

  private async handleDispute(ctx: Context, tradeId: string) {
    const trade = this.tradeManager.getTrade(tradeId);
    if (!trade) {
      await ctx.reply('Trade not found.');
      return;
    }

    this.tradeManager.updateTradeStatus(tradeId, TradeStatus.DISPUTED);
    
    await ctx.reply(
      '⚠️ Dispute opened.\n' +
      'An admin will review the case and resolve the dispute.\n' +
      'Please provide evidence to support your claim.'
    );
  }

  private async handleText(ctx: Context) {
    const text = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const userId = ctx.from?.id;
    if (!userId) return;

    // Handle text-based button presses
    switch (text) {
      case '💰 Buy Crypto':
        await this.handleBuy(ctx);
        break;
      case '💵 Sell Crypto':
        await this.handleSell(ctx);
        break;
      case '📋 My Orders':
        await this.handleOrders(ctx);
        break;
      case '🔄 My Trades':
        await this.handleTrades(ctx);
        break;
      case '👛 Wallet':
        await this.handleWallet(ctx);
        break;
      case '❓ Help':
        await this.handleHelp(ctx);
        break;
      default:
        // Check if user is in a session awaiting input
        const session = this.userSessions.get(userId);
        if (session) {
          // Handle session-specific input
        }
    }
  }

  start() {
    this.bot.launch();
    console.log('Telegram bot started successfully');
  }

  stop() {
    this.bot.stop();
  }
}
