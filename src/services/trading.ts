import { Address } from '@ton/core';
import { Order, Trade, EscrowData } from '../types';

export class OrderBook {
  private buyOrders: Map<string, Order> = new Map();
  private sellOrders: Map<string, Order> = new Map();

  addOrder(order: Order): void {
    if (order.type === 'buy') {
      this.buyOrders.set(order.id, order);
    } else {
      this.sellOrders.set(order.id, order);
    }
  }

  getOrder(orderId: string): Order | undefined {
    return this.buyOrders.get(orderId) || this.sellOrders.get(orderId);
  }

  removeOrder(orderId: string): void {
    this.buyOrders.delete(orderId);
    this.sellOrders.delete(orderId);
  }

  getBuyOrders(currency?: string): Order[] {
    const orders = Array.from(this.buyOrders.values())
      .filter(order => order.status === 'active');
    
    if (currency) {
      return orders.filter(order => order.fiatCurrency === currency);
    }
    return orders;
  }

  getSellOrders(currency?: string): Order[] {
    const orders = Array.from(this.sellOrders.values())
      .filter(order => order.status === 'active');
    
    if (currency) {
      return orders.filter(order => order.fiatCurrency === currency);
    }
    return orders;
  }

  matchOrder(order: Order): Order | null {
    const oppositeOrders = order.type === 'buy' 
      ? this.getSellOrders(order.fiatCurrency)
      : this.getBuyOrders(order.fiatCurrency);

    for (const oppositeOrder of oppositeOrders) {
      if (this.canMatch(order, oppositeOrder)) {
        return oppositeOrder;
      }
    }
    return null;
  }

  private canMatch(order1: Order, order2: Order): boolean {
    if (order1.fiatCurrency !== order2.fiatCurrency) return false;
    if (order1.type === order2.type) return false;
    
    const buyOrder = order1.type === 'buy' ? order1 : order2;
    const sellOrder = order1.type === 'sell' ? order1 : order2;

    return buyOrder.price >= sellOrder.price;
  }
}

export class TradeManager {
  private trades: Map<string, Trade> = new Map();

  createTrade(trade: Trade): void {
    this.trades.set(trade.id, trade);
  }

  getTrade(tradeId: string): Trade | undefined {
    return this.trades.get(tradeId);
  }

  updateTradeStatus(tradeId: string, status: Trade['status']): void {
    const trade = this.trades.get(tradeId);
    if (trade) {
      trade.status = status;
      trade.updatedAt = new Date();
    }
  }

  getUserTrades(userId: number): Trade[] {
    return Array.from(this.trades.values())
      .filter(trade => trade.buyerId === userId || trade.sellerId === userId);
  }

  getActiveTrades(): Trade[] {
    return Array.from(this.trades.values())
      .filter(trade => 
        trade.status !== 'completed' && 
        trade.status !== 'cancelled'
      );
  }
}

export class EscrowManager {
  async deployEscrow(
    buyer: Address,
    seller: Address,
    tradeId: string,
    timeout: number
  ): Promise<Address> {
    // In a real implementation, this would deploy the smart contract
    // For now, return a mock address
    console.log('Deploying escrow contract:', { buyer, seller, tradeId, timeout });
    return buyer; // Mock return
  }

  async releaseFunds(escrowAddress: Address, tradeId: string): Promise<void> {
    console.log('Releasing funds from escrow:', { escrowAddress, tradeId });
    // Send transaction to release funds
  }

  async cancelTrade(escrowAddress: Address, tradeId: string): Promise<void> {
    console.log('Cancelling trade and refunding:', { escrowAddress, tradeId });
    // Send transaction to cancel and refund
  }

  async openDispute(escrowAddress: Address, tradeId: string): Promise<void> {
    console.log('Opening dispute for trade:', { escrowAddress, tradeId });
    // Send transaction to mark as disputed
  }

  async getEscrowData(escrowAddress: Address): Promise<EscrowData | null> {
    console.log('Getting escrow data for:', escrowAddress);
    // Query contract state
    return null;
  }
}
