export function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function validateAddress(address: string): boolean {
  // Basic TON address validation
  return /^[E|U]Q[A-Za-z0-9_-]{46}$/.test(address);
}

export function calculateTimeout(hours: number): number {
  return hours * 3600; // Convert to seconds
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function generateTradeId(): string {
  return `TR${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

export function isValidPaymentMethod(method: string): boolean {
  const validMethods = ['PayPal', 'Bank Transfer', 'Wise', 'Revolut', 'Zelle', 'Venmo'];
  return validMethods.some(m => m.toLowerCase() === method.toLowerCase());
}

export function calculateFee(amount: number, feePercent: number = 0.5): number {
  return amount * (feePercent / 100);
}

export class RateLimiter {
  private requests: Map<number, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  checkLimit(userId: number): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    return true;
  }

  reset(userId: number): void {
    this.requests.delete(userId);
  }
}

export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}
