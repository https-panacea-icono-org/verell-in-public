import { TradeManager } from '../src/utils/tradeManager';
import { OrderType, TradeStatus, OrderStatus } from '../src/types';

describe('TradeManager', () => {
  let tradeManager: TradeManager;

  beforeEach(() => {
    tradeManager = new TradeManager();
  });

  describe('Order Management', () => {
    test('should create a sell order', () => {
      const order = tradeManager.createOrder(
        12345,
        OrderType.SELL,
        'USD',
        'TON',
        100,
        2.5,
        ['Bank Transfer', 'PayPal']
      );

      expect(order).toBeDefined();
      expect(order.userId).toBe(12345);
      expect(order.type).toBe(OrderType.SELL);
      expect(order.currency).toBe('USD');
      expect(order.cryptoCurrency).toBe('TON');
      expect(order.amount).toBe(100);
      expect(order.price).toBe(2.5);
      expect(order.status).toBe(OrderStatus.ACTIVE);
    });

    test('should get active orders', () => {
      tradeManager.createOrder(
        12345,
        OrderType.SELL,
        'USD',
        'TON',
        100,
        2.5,
        ['Bank Transfer']
      );

      tradeManager.createOrder(
        67890,
        OrderType.BUY,
        'EUR',
        'TON',
        200,
        2.3,
        ['PayPal']
      );

      const sellOrders = tradeManager.getActiveOrders(OrderType.SELL);
      const buyOrders = tradeManager.getActiveOrders(OrderType.BUY);

      expect(sellOrders.length).toBe(1);
      expect(buyOrders.length).toBe(1);
    });

    test('should cancel order', () => {
      const order = tradeManager.createOrder(
        12345,
        OrderType.SELL,
        'USD',
        'TON',
        100,
        2.5,
        ['Bank Transfer']
      );

      const success = tradeManager.cancelOrder(order.id);
      expect(success).toBe(true);

      const cancelledOrder = tradeManager.getOrder(order.id);
      expect(cancelledOrder?.status).toBe(OrderStatus.CANCELLED);
    });
  });

  describe('Trade Management', () => {
    test('should create a trade from order', () => {
      const order = tradeManager.createOrder(
        12345,
        OrderType.SELL,
        'USD',
        'TON',
        100,
        2.5,
        ['Bank Transfer']
      );

      const trade = tradeManager.createTrade(
        order.id,
        67890, // buyer
        12345, // seller
        100,
        'USD',
        40, // crypto amount
        'TON',
        2.5,
        'Bank Transfer'
      );

      expect(trade).toBeDefined();
      expect(trade?.buyerId).toBe(67890);
      expect(trade?.sellerId).toBe(12345);
      expect(trade?.status).toBe(TradeStatus.CREATED);
    });

    test('should update trade status', () => {
      const order = tradeManager.createOrder(
        12345,
        OrderType.SELL,
        'USD',
        'TON',
        100,
        2.5,
        ['Bank Transfer']
      );

      const trade = tradeManager.createTrade(
        order.id,
        67890,
        12345,
        100,
        'USD',
        40,
        'TON',
        2.5,
        'Bank Transfer'
      );

      if (trade) {
        const success = tradeManager.updateTradeStatus(trade.id, TradeStatus.FUNDED);
        expect(success).toBe(true);

        const updatedTrade = tradeManager.getTrade(trade.id);
        expect(updatedTrade?.status).toBe(TradeStatus.FUNDED);
      }
    });

    test('should get user trades', () => {
      const order = tradeManager.createOrder(
        12345,
        OrderType.SELL,
        'USD',
        'TON',
        100,
        2.5,
        ['Bank Transfer']
      );

      tradeManager.createTrade(
        order.id,
        67890,
        12345,
        100,
        'USD',
        40,
        'TON',
        2.5,
        'Bank Transfer'
      );

      const buyerTrades = tradeManager.getUserTrades(67890);
      const sellerTrades = tradeManager.getUserTrades(12345);

      expect(buyerTrades.length).toBe(1);
      expect(sellerTrades.length).toBe(1);
    });

    test('should complete trade', () => {
      const order = tradeManager.createOrder(
        12345,
        OrderType.SELL,
        'USD',
        'TON',
        100,
        2.5,
        ['Bank Transfer']
      );

      const trade = tradeManager.createTrade(
        order.id,
        67890,
        12345,
        100,
        'USD',
        40,
        'TON',
        2.5,
        'Bank Transfer'
      );

      if (trade) {
        const success = tradeManager.completeTrade(trade.id);
        expect(success).toBe(true);

        const completedTrade = tradeManager.getTrade(trade.id);
        expect(completedTrade?.status).toBe(TradeStatus.COMPLETED);
      }
    });

    test('should set escrow address', () => {
      const order = tradeManager.createOrder(
        12345,
        OrderType.SELL,
        'USD',
        'TON',
        100,
        2.5,
        ['Bank Transfer']
      );

      const trade = tradeManager.createTrade(
        order.id,
        67890,
        12345,
        100,
        'USD',
        40,
        'TON',
        2.5,
        'Bank Transfer'
      );

      if (trade) {
        const escrowAddress = 'EQD1234567890abcdef';
        const success = tradeManager.setEscrowAddress(trade.id, escrowAddress);
        expect(success).toBe(true);

        const updatedTrade = tradeManager.getTrade(trade.id);
        expect(updatedTrade?.escrowAddress).toBe(escrowAddress);
      }
    });
  });
});
