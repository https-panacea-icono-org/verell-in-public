import express, { Request, Response } from 'express';
import { TradeManager } from '../utils/tradeManager';
import { TONService } from '../utils/ton';
import { OrderType } from '../types';

export class APIServer {
  private app: express.Application;
  private tradeManager: TradeManager;
  private tonService: TONService;
  private port: number;

  constructor(tradeManager: TradeManager, tonService: TONService, port: number = 3000) {
    this.app = express();
    this.tradeManager = tradeManager;
    this.tonService = tonService;
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    });
  }

  private setupRoutes() {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Get active orders
    this.app.get('/api/orders', (req: Request, res: Response) => {
      const type = req.query.type as OrderType | undefined;
      const orders = this.tradeManager.getActiveOrders(type);
      res.json({ orders });
    });

    // Create order
    this.app.post('/api/orders', (req: Request, res: Response) => {
      try {
        const {
          userId,
          type,
          currency,
          cryptoCurrency,
          amount,
          price,
          paymentMethods,
          minAmount,
          maxAmount
        } = req.body;

        if (!userId || !type || !currency || !cryptoCurrency || !amount || !price || !paymentMethods) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const order = this.tradeManager.createOrder(
          userId,
          type,
          currency,
          cryptoCurrency,
          amount,
          price,
          paymentMethods,
          minAmount,
          maxAmount
        );

        res.json({ order });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
      }
    });

    // Get specific order
    this.app.get('/api/orders/:orderId', (req: Request, res: Response) => {
      const order = this.tradeManager.getOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ order });
    });

    // Cancel order
    this.app.delete('/api/orders/:orderId', (req: Request, res: Response) => {
      const success = this.tradeManager.cancelOrder(req.params.orderId);
      if (!success) {
        return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
      }
      res.json({ message: 'Order cancelled successfully' });
    });

    // Create trade
    this.app.post('/api/trades', (req: Request, res: Response) => {
      try {
        const {
          orderId,
          buyerId,
          sellerId,
          amount,
          currency,
          cryptoAmount,
          cryptoCurrency,
          price,
          paymentMethod
        } = req.body;

        if (!orderId || !buyerId || !sellerId || !amount || !currency || !cryptoAmount || !cryptoCurrency || !price || !paymentMethod) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const trade = this.tradeManager.createTrade(
          orderId,
          buyerId,
          sellerId,
          amount,
          currency,
          cryptoAmount,
          cryptoCurrency,
          price,
          paymentMethod
        );

        if (!trade) {
          return res.status(400).json({ error: 'Failed to create trade' });
        }

        res.json({ trade });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create trade' });
      }
    });

    // Get specific trade
    this.app.get('/api/trades/:tradeId', (req: Request, res: Response) => {
      const trade = this.tradeManager.getTrade(req.params.tradeId);
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }
      res.json({ trade });
    });

    // Get user trades
    this.app.get('/api/users/:userId/trades', (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      const trades = this.tradeManager.getUserTrades(userId);
      res.json({ trades });
    });

    // Update trade status
    this.app.put('/api/trades/:tradeId/status', (req: Request, res: Response) => {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const success = this.tradeManager.updateTradeStatus(req.params.tradeId, status);
      if (!success) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.json({ message: 'Trade status updated successfully' });
    });

    // Set escrow address
    this.app.put('/api/trades/:tradeId/escrow', (req: Request, res: Response) => {
      const { escrowAddress } = req.body;
      if (!escrowAddress) {
        return res.status(400).json({ error: 'Escrow address is required' });
      }

      if (!this.tonService.isValidAddress(escrowAddress)) {
        return res.status(400).json({ error: 'Invalid TON address' });
      }

      const success = this.tradeManager.setEscrowAddress(req.params.tradeId, escrowAddress);
      if (!success) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.json({ message: 'Escrow address set successfully' });
    });

    // Get escrow data
    this.app.get('/api/escrow/:address', async (req: Request, res: Response) => {
      try {
        const data = await this.tonService.getEscrowData(req.params.address);
        res.json({ data });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch escrow data' });
      }
    });

    // Check wallet balance
    this.app.get('/api/wallet/:address/balance', async (req: Request, res: Response) => {
      try {
        const balance = await this.tonService.getBalance(req.params.address);
        res.json({ balance: balance.toString() });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch balance' });
      }
    });

    // Validate TON address
    this.app.post('/api/wallet/validate', (req: Request, res: Response) => {
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      const isValid = this.tonService.isValidAddress(address);
      res.json({ valid: isValid });
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`API server listening on port ${this.port}`);
    });
  }
}
