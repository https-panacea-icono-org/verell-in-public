import { Telegraf, Markup, Context } from 'telegraf';
import { v4 as uuidv4 } from 'uuid';
import { Order, Trade, OrderType } from '../types';
import { OrderBook, TradeManager } from '../services/trading';
import { BlockchainService } from '../services/blockchain';

export class TelegramBot {
  private bot: Telegraf;
  private orderBook: OrderBook;
  private tradeManager: TradeManager;
  private blockchain: BlockchainService;

  constructor(token: string) {
    this.bot = new Telegraf(token);
    this.orderBook = new OrderBook();
    this.tradeManager = new TradeManager();
    this.blockchain = new BlockchainService(true); // testnet

    this.setupCommands();
    this.setupCallbacks();
  }

  private setupCommands(): void {
    this.bot.command('start', (ctx) => this.handleStart(ctx));
    this.bot.command('help', (ctx) => this.handleHelp(ctx));
    this.bot.command('buy', (ctx) => this.handleCreateBuyOrder(ctx));
    this.bot.command('sell', (ctx) => this.handleCreateSellOrder(ctx));
    this.bot.command('orders', (ctx) => this.handleListOrders(ctx));
    this.bot.command('mytrades', (ctx) => this.handleMyTrades(ctx));
    this.bot.command('wallet', (ctx) => this.handleWallet(ctx));
    this.bot.command('cancel', (ctx) => this.handleCancel(ctx));
  }

  private setupCallbacks(): void {
    this.bot.action(/accept_order:(.+)/, (ctx) => this.handleAcceptOrder(ctx));
    this.bot.action(/payment_sent:(.+)/, (ctx) => this.handlePaymentSent(ctx));
    this.bot.action(/payment_received:(.+)/, (ctx) => this.handlePaymentReceived(ctx));
    this.bot.action(/dispute:(.+)/, (ctx) => this.handleDispute(ctx));
    this.bot.action(/cancel_trade:(.+)/, (ctx) => this.handleCancelTrade(ctx));
  }

  private async handleStart(ctx: Context): Promise<void> {
    const welcomeMessage = `
🎉 *Welcome to Verell P2P DEX!*

A secure, non-custodial peer-to-peer exchange for TON cryptocurrency.

*Key Features:*
• 🔒 On-chain escrow for secure trades
• 💱 Direct fiat-to-crypto exchange
• 🤝 P2P trading with verified users
• ⚡ Fast and transparent transactions

*Quick Start:*
/buy - Create a buy order
/sell - Create a sell order
/orders - View available orders
/mytrades - View your active trades
/wallet - Manage your TON wallet
/help - Get detailed help

Let's get started! 🚀
    `;

    await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
  }

  private async handleHelp(ctx: Context): Promise<void> {
    const helpMessage = `
📖 *Verell P2P DEX Help*

*Commands:*
/buy - Create a buy order for TON
/sell - Create a sell order for TON
/orders - Browse available orders
/mytrades - View your active trades
/wallet - Connect and manage your wallet
/cancel - Cancel pending order or trade

*How to Trade:*
1️⃣ Create or accept an order
2️⃣ Buyer sends TON to escrow
3️⃣ Seller sends fiat via agreed method
4️⃣ Buyer confirms payment received
5️⃣ Funds released from escrow

*Safety Tips:*
• Always verify payment details
• Use escrow for all trades
• Report suspicious activity
• Keep communication in chat

Need support? Contact @VerellSupport
    `;

    await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
  }

  private async handleCreateBuyOrder(ctx: Context): Promise<void> {
    const usage = `
*Create Buy Order*

Usage: \`/buy <amount> <currency> <price> <payment_method>\`

Example: \`/buy 100 USD 2.5 PayPal\`
This creates a buy order for 100 USD worth of TON at $2.5 per TON using PayPal.

*Supported Currencies:* USD, EUR, GBP, RUB
*Payment Methods:* PayPal, Bank Transfer, Wise, Revolut
    `;

    const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ').slice(1) : [];
    
    if (args.length < 4) {
      await ctx.reply(usage, { parse_mode: 'Markdown' });
      return;
    }

    const [fiatAmount, currency, price, ...paymentMethodParts] = args;
    const paymentMethod = paymentMethodParts.join(' ');

    const order: Order = {
      id: uuidv4(),
      userId: ctx.from!.id,
      type: OrderType.BUY,
      cryptoAmount: parseFloat(fiatAmount) / parseFloat(price),
      fiatAmount: parseFloat(fiatAmount),
      fiatCurrency: currency.toUpperCase(),
      paymentMethods: [paymentMethod],
      price: parseFloat(price),
      status: 'active',
      createdAt: new Date(),
    };

    this.orderBook.addOrder(order);

    const orderMessage = `
✅ *Buy Order Created!*

Order ID: \`${order.id}\`
Amount: ${order.fiatAmount} ${order.fiatCurrency}
TON Amount: ${order.cryptoAmount.toFixed(2)} TON
Price: ${order.price} ${order.fiatCurrency}/TON
Payment: ${paymentMethod}

Your order is now active! You'll be notified when someone accepts it.
    `;

    await ctx.reply(orderMessage, { parse_mode: 'Markdown' });
  }

  private async handleCreateSellOrder(ctx: Context): Promise<void> {
    const usage = `
*Create Sell Order*

Usage: \`/sell <amount_ton> <currency> <price> <payment_method>\`

Example: \`/sell 50 USD 2.5 Bank Transfer\`
This creates a sell order for 50 TON at $2.5 per TON accepting Bank Transfer.

*Supported Currencies:* USD, EUR, GBP, RUB
*Payment Methods:* PayPal, Bank Transfer, Wise, Revolut
    `;

    const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ').slice(1) : [];
    
    if (args.length < 4) {
      await ctx.reply(usage, { parse_mode: 'Markdown' });
      return;
    }

    const [cryptoAmount, currency, price, ...paymentMethodParts] = args;
    const paymentMethod = paymentMethodParts.join(' ');

    const order: Order = {
      id: uuidv4(),
      userId: ctx.from!.id,
      type: OrderType.SELL,
      cryptoAmount: parseFloat(cryptoAmount),
      fiatAmount: parseFloat(cryptoAmount) * parseFloat(price),
      fiatCurrency: currency.toUpperCase(),
      paymentMethods: [paymentMethod],
      price: parseFloat(price),
      status: 'active',
      createdAt: new Date(),
    };

    this.orderBook.addOrder(order);

    const orderMessage = `
✅ *Sell Order Created!*

Order ID: \`${order.id}\`
TON Amount: ${order.cryptoAmount.toFixed(2)} TON
Fiat Amount: ${order.fiatAmount} ${order.fiatCurrency}
Price: ${order.price} ${order.fiatCurrency}/TON
Payment: ${paymentMethod}

Your order is now active! You'll be notified when someone accepts it.
    `;

    await ctx.reply(orderMessage, { parse_mode: 'Markdown' });
  }

  private async handleListOrders(ctx: Context): Promise<void> {
    const buyOrders = this.orderBook.getBuyOrders();
    const sellOrders = this.orderBook.getSellOrders();

    let message = '📋 *Available Orders*\n\n';

    if (buyOrders.length > 0) {
      message += '*Buy Orders (others want to buy TON):*\n';
      buyOrders.slice(0, 5).forEach((order, index) => {
        message += `${index + 1}. ${order.fiatAmount} ${order.fiatCurrency} @ ${order.price} ${order.fiatCurrency}/TON\n`;
        message += `   Payment: ${order.paymentMethods.join(', ')}\n`;
      });
      message += '\n';
    }

    if (sellOrders.length > 0) {
      message += '*Sell Orders (others want to sell TON):*\n';
      sellOrders.slice(0, 5).forEach((order, index) => {
        message += `${index + 1}. ${order.cryptoAmount.toFixed(2)} TON @ ${order.price} ${order.fiatCurrency}/TON\n`;
        message += `   Payment: ${order.paymentMethods.join(', ')}\n`;
      });
    }

    if (buyOrders.length === 0 && sellOrders.length === 0) {
      message += 'No active orders at the moment. Create one with /buy or /sell!';
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  private async handleMyTrades(ctx: Context): Promise<void> {
    const userId = ctx.from!.id;
    const trades = this.tradeManager.getUserTrades(userId);

    if (trades.length === 0) {
      await ctx.reply('You have no active trades.');
      return;
    }

    let message = '💼 *Your Active Trades*\n\n';

    trades.forEach((trade, index) => {
      const isBuyer = trade.buyerId === userId;
      message += `${index + 1}. Trade #${trade.id.substring(0, 8)}\n`;
      message += `   Role: ${isBuyer ? 'Buyer' : 'Seller'}\n`;
      message += `   Amount: ${trade.cryptoAmount.toFixed(2)} TON\n`;
      message += `   Status: ${trade.status}\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  private async handleWallet(ctx: Context): Promise<void> {
    const walletMessage = `
💼 *TON Wallet Management*

To use this DEX, you need a TON wallet. 

*Recommended Wallets:*
• Tonkeeper (Mobile & Extension)
• Tonhub (Mobile)
• OpenMask (Browser Extension)

*Connect Your Wallet:*
1. Install a TON wallet
2. Create or import your wallet
3. Share your address using /connect <address>

*Example:*
\`/connect EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2\`

Your funds are always in your control. We never hold your keys! 🔐
    `;

    await ctx.reply(walletMessage, { parse_mode: 'Markdown' });
  }

  private async handleCancel(ctx: Context): Promise<void> {
    await ctx.reply('Cancel functionality - to be implemented based on context');
  }

  private async handleAcceptOrder(ctx: Context): Promise<void> {
    const orderId = ctx.match![1];
    await ctx.reply(`Accepting order ${orderId}...`);
    // Implementation for accepting orders
  }

  private async handlePaymentSent(ctx: Context): Promise<void> {
    const tradeId = ctx.match![1];
    await ctx.reply(`Marking payment as sent for trade ${tradeId}...`);
    // Implementation for marking payment as sent
  }

  private async handlePaymentReceived(ctx: Context): Promise<void> {
    const tradeId = ctx.match![1];
    await ctx.reply(`Confirming payment received for trade ${tradeId}...`);
    // Implementation for confirming payment
  }

  private async handleDispute(ctx: Context): Promise<void> {
    const tradeId = ctx.match![1];
    await ctx.reply(`Opening dispute for trade ${tradeId}...`);
    // Implementation for opening disputes
  }

  private async handleCancelTrade(ctx: Context): Promise<void> {
    const tradeId = ctx.match![1];
    await ctx.reply(`Cancelling trade ${tradeId}...`);
    // Implementation for cancelling trades
  }

  start(): void {
    this.bot.launch();
    console.log('Telegram bot started successfully!');

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
