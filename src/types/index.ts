export interface User {
  telegramId: number;
  username?: string;
  walletAddress?: string;
  reputation: number;
  tradesCompleted: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: number;
  type: 'buy' | 'sell';
  cryptoAmount: number;
  fiatAmount: number;
  fiatCurrency: string;
  paymentMethods: string[];
  minLimit?: number;
  maxLimit?: number;
  price: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  expiresAt?: Date;
}

export interface Trade {
  id: string;
  orderId: string;
  buyerId: number;
  sellerId: number;
  cryptoAmount: number;
  fiatAmount: number;
  fiatCurrency: string;
  paymentMethod: string;
  status: 'initiated' | 'escrow_funded' | 'payment_sent' | 'payment_confirmed' | 'completed' | 'disputed' | 'cancelled';
  escrowAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  timeout: number;
}

export interface EscrowData {
  buyer: string;
  seller: string;
  amount: number;
  tradeId: string;
  status: 0 | 1 | 2 | 3;
  createdAt: number;
  timeout: number;
}

export interface Dispute {
  id: string;
  tradeId: string;
  openedBy: number;
  reason: string;
  status: 'open' | 'investigating' | 'resolved';
  resolution?: 'buyer' | 'seller' | 'split';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface TelegramCallbackData {
  action: string;
  data: any;
}

export enum TradeStatus {
  INITIATED = 'initiated',
  ESCROW_FUNDED = 'escrow_funded',
  PAYMENT_SENT = 'payment_sent',
  PAYMENT_CONFIRMED = 'payment_confirmed',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled'
}

export enum OrderType {
  BUY = 'buy',
  SELL = 'sell'
}
