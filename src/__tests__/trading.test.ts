import { OrderBook, TradeManager } from '../services/trading';
import { Order, OrderType } from '../types';

describe('OrderBook', () => {
  let orderBook: OrderBook;

  beforeEach(() => {
    orderBook = new OrderBook();
  });

  describe('addOrder', () => {
    it('should add a buy order to the order book', () => {
      const order: Order = {
        id: 'test-order-1',
        userId: 123456,
        type: OrderType.BUY,
        cryptoAmount: 10,
        fiatAmount: 100,
        fiatCurrency: 'USD',
        paymentMethods: ['PayPal'],
        price: 10,
        status: 'active',
        createdAt: new Date(),
      };

      orderBook.addOrder(order);
      const retrieved = orderBook.getOrder(order.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(order.id);
      expect(retrieved?.type).toBe(OrderType.BUY);
    });

    it('should add a sell order to the order book', () => {
      const order: Order = {
        id: 'test-order-2',
        userId: 789012,
        type: OrderType.SELL,
        cryptoAmount: 20,
        fiatAmount: 200,
        fiatCurrency: 'USD',
        paymentMethods: ['Bank Transfer'],
        price: 10,
        status: 'active',
        createdAt: new Date(),
      };

      orderBook.addOrder(order);
      const retrieved = orderBook.getOrder(order.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.type).toBe(OrderType.SELL);
    });
  });

  describe('getBuyOrders', () => {
    it('should return all active buy orders', () => {
      const order1: Order = {
        id: 'buy-1',
        userId: 123,
        type: OrderType.BUY,
        cryptoAmount: 10,
        fiatAmount: 100,
        fiatCurrency: 'USD',
        paymentMethods: ['PayPal'],
        price: 10,
        status: 'active',
        createdAt: new Date(),
      };

      const order2: Order = {
        id: 'buy-2',
        userId: 456,
        type: OrderType.BUY,
        cryptoAmount: 20,
        fiatAmount: 200,
        fiatCurrency: 'EUR',
        paymentMethods: ['Wise'],
        price: 10,
        status: 'active',
        createdAt: new Date(),
      };

      orderBook.addOrder(order1);
      orderBook.addOrder(order2);

      const buyOrders = orderBook.getBuyOrders();
      expect(buyOrders).toHaveLength(2);
    });

    it('should filter buy orders by currency', () => {
      const orderUSD: Order = {
        id: 'buy-usd',
        userId: 123,
        type: OrderType.BUY,
        cryptoAmount: 10,
        fiatAmount: 100,
        fiatCurrency: 'USD',
        paymentMethods: ['PayPal'],
        price: 10,
        status: 'active',
        createdAt: new Date(),
      };

      const orderEUR: Order = {
        id: 'buy-eur',
        userId: 456,
        type: OrderType.BUY,
        cryptoAmount: 20,
        fiatAmount: 200,
        fiatCurrency: 'EUR',
        paymentMethods: ['Wise'],
        price: 10,
        status: 'active',
        createdAt: new Date(),
      };

      orderBook.addOrder(orderUSD);
      orderBook.addOrder(orderEUR);

      const usdOrders = orderBook.getBuyOrders('USD');
      expect(usdOrders).toHaveLength(1);
      expect(usdOrders[0].fiatCurrency).toBe('USD');
    });
  });

  describe('removeOrder', () => {
    it('should remove an order from the order book', () => {
      const order: Order = {
        id: 'remove-test',
        userId: 123,
        type: OrderType.BUY,
        cryptoAmount: 10,
        fiatAmount: 100,
        fiatCurrency: 'USD',
        paymentMethods: ['PayPal'],
        price: 10,
        status: 'active',
        createdAt: new Date(),
      };

      orderBook.addOrder(order);
      expect(orderBook.getOrder(order.id)).toBeDefined();
      
      orderBook.removeOrder(order.id);
      expect(orderBook.getOrder(order.id)).toBeUndefined();
    });
  });
});

describe('TradeManager', () => {
  let tradeManager: TradeManager;

  beforeEach(() => {
    tradeManager = new TradeManager();
  });

  describe('createTrade', () => {
    it('should create a new trade', () => {
      const trade = {
        id: 'trade-1',
        orderId: 'order-1',
        buyerId: 123,
        sellerId: 456,
        cryptoAmount: 10,
        fiatAmount: 100,
        fiatCurrency: 'USD',
        paymentMethod: 'PayPal',
        status: 'initiated' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeout: 3600,
      };

      tradeManager.createTrade(trade);
      const retrieved = tradeManager.getTrade(trade.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(trade.id);
    });
  });

  describe('updateTradeStatus', () => {
    it('should update trade status', () => {
      const trade = {
        id: 'trade-status',
        orderId: 'order-1',
        buyerId: 123,
        sellerId: 456,
        cryptoAmount: 10,
        fiatAmount: 100,
        fiatCurrency: 'USD',
        paymentMethod: 'PayPal',
        status: 'initiated' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeout: 3600,
      };

      tradeManager.createTrade(trade);
      tradeManager.updateTradeStatus(trade.id, 'payment_sent');
      
      const updated = tradeManager.getTrade(trade.id);
      expect(updated?.status).toBe('payment_sent');
    });
  });

  describe('getUserTrades', () => {
    it('should return trades for a specific user', () => {
      const trade1 = {
        id: 'trade-user-1',
        orderId: 'order-1',
        buyerId: 123,
        sellerId: 456,
        cryptoAmount: 10,
        fiatAmount: 100,
        fiatCurrency: 'USD',
        paymentMethod: 'PayPal',
        status: 'initiated' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeout: 3600,
      };

      const trade2 = {
        id: 'trade-user-2',
        orderId: 'order-2',
        buyerId: 789,
        sellerId: 123,
        cryptoAmount: 20,
        fiatAmount: 200,
        fiatCurrency: 'EUR',
        paymentMethod: 'Wise',
        status: 'initiated' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeout: 3600,
      };

      tradeManager.createTrade(trade1);
      tradeManager.createTrade(trade2);

      const userTrades = tradeManager.getUserTrades(123);
      expect(userTrades).toHaveLength(2);
    });
  });
});
