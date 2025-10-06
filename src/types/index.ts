export interface Trade {
  id: string;
  buyerId: number;
  sellerId: number;
  amount: number;
  currency: string;
  cryptoAmount: number;
  cryptoCurrency: string;
  price: number;
  status: TradeStatus;
  paymentMethod: string;
  escrowAddress?: string;
  createdAt: Date;
  expiresAt: Date;
  sellerPaymentDetails?: string;
}

export enum TradeStatus {
  CREATED = 'created',
  FUNDED = 'funded',
  PENDING_PAYMENT = 'pending_payment',
  PAYMENT_SENT = 'payment_sent',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export interface Order {
  id: string;
  userId: number;
  type: OrderType;
  currency: string;
  cryptoCurrency: string;
  amount: number;
  price: number;
  minAmount?: number;
  maxAmount?: number;
  paymentMethods: string[];
  status: OrderStatus;
  createdAt: Date;
}

export enum OrderType {
  BUY = 'buy',
  SELL = 'sell'
}

export enum OrderStatus {
  ACTIVE = 'active',
  MATCHED = 'matched',
  CANCELLED = 'cancelled'
}

export interface User {
  telegramId: number;
  username?: string;
  walletAddress?: string;
  reputation: number;
  tradesCompleted: number;
  createdAt: Date;
}

export interface EscrowOperation {
  op: number;
  tradeId: string;
  amount: number;
  buyerAddress: string;
  sellerAddress: string;
  expiryTime: number;
}
