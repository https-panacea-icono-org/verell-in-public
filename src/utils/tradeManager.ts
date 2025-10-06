import { v4 as uuidv4 } from 'uuid';
import { Trade, Order, TradeStatus, OrderStatus, OrderType } from '../types';

export class TradeManager {
  private trades: Map<string, Trade> = new Map();
  private orders: Map<string, Order> = new Map();

  /**
   * Create a new buy/sell order
   */
  createOrder(
    userId: number,
    type: OrderType,
    currency: string,
    cryptoCurrency: string,
    amount: number,
    price: number,
    paymentMethods: string[],
    minAmount?: number,
    maxAmount?: number
  ): Order {
    const order: Order = {
      id: uuidv4(),
      userId,
      type,
      currency,
      cryptoCurrency,
      amount,
      price,
      minAmount,
      maxAmount,
      paymentMethods,
      status: OrderStatus.ACTIVE,
      createdAt: new Date()
    };

    this.orders.set(order.id, order);
    return order;
  }

  /**
   * Get active orders
   */
  getActiveOrders(type?: OrderType): Order[] {
    return Array.from(this.orders.values())
      .filter(order => 
        order.status === OrderStatus.ACTIVE && 
        (!type || order.type === type)
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Match buyer with seller and create trade
   */
  createTrade(
    orderId: string,
    buyerId: number,
    sellerId: number,
    amount: number,
    currency: string,
    cryptoAmount: number,
    cryptoCurrency: string,
    price: number,
    paymentMethod: string
  ): Trade | null {
    const order = this.orders.get(orderId);
    if (!order || order.status !== OrderStatus.ACTIVE) {
      return null;
    }

    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24); // 24 hour expiry

    const trade: Trade = {
      id: uuidv4(),
      buyerId,
      sellerId,
      amount,
      currency,
      cryptoAmount,
      cryptoCurrency,
      price,
      status: TradeStatus.CREATED,
      paymentMethod,
      createdAt: new Date(),
      expiresAt: expiryTime
    };

    this.trades.set(trade.id, trade);
    order.status = OrderStatus.MATCHED;
    
    return trade;
  }

  /**
   * Update trade status
   */
  updateTradeStatus(tradeId: string, status: TradeStatus): boolean {
    const trade = this.trades.get(tradeId);
    if (!trade) {
      return false;
    }

    trade.status = status;
    return true;
  }

  /**
   * Set escrow address for trade
   */
  setEscrowAddress(tradeId: string, escrowAddress: string): boolean {
    const trade = this.trades.get(tradeId);
    if (!trade) {
      return false;
    }

    trade.escrowAddress = escrowAddress;
    return true;
  }

  /**
   * Set seller payment details
   */
  setPaymentDetails(tradeId: string, paymentDetails: string): boolean {
    const trade = this.trades.get(tradeId);
    if (!trade) {
      return false;
    }

    trade.sellerPaymentDetails = paymentDetails;
    return true;
  }

  /**
   * Get trade by ID
   */
  getTrade(tradeId: string): Trade | undefined {
    return this.trades.get(tradeId);
  }

  /**
   * Get user's active trades
   */
  getUserTrades(userId: number): Trade[] {
    return Array.from(this.trades.values())
      .filter(trade => 
        (trade.buyerId === userId || trade.sellerId === userId) &&
        trade.status !== TradeStatus.COMPLETED &&
        trade.status !== TradeStatus.CANCELLED
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: string): boolean {
    const order = this.orders.get(orderId);
    if (!order || order.status !== OrderStatus.ACTIVE) {
      return false;
    }

    order.status = OrderStatus.CANCELLED;
    return true;
  }

  /**
   * Cancel trade
   */
  cancelTrade(tradeId: string): boolean {
    const trade = this.trades.get(tradeId);
    if (!trade) {
      return false;
    }

    trade.status = TradeStatus.CANCELLED;
    return true;
  }

  /**
   * Complete trade
   */
  completeTrade(tradeId: string): boolean {
    const trade = this.trades.get(tradeId);
    if (!trade) {
      return false;
    }

    trade.status = TradeStatus.COMPLETED;
    return true;
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }
}
