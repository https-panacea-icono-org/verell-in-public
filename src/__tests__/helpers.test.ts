import {
  formatDate,
  validateAddress,
  calculateTimeout,
  formatCurrency,
  generateTradeId,
  isValidPaymentMethod,
  calculateFee,
  RateLimiter,
} from '../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('validateAddress', () => {
    it('should validate correct TON address', () => {
      const validAddress = 'EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2';
      expect(validateAddress(validAddress)).toBe(true);
    });

    it('should reject invalid TON address', () => {
      const invalidAddress = 'invalid-address';
      expect(validateAddress(invalidAddress)).toBe(false);
    });

    it('should validate UQ addresses', () => {
      const uqAddress = 'UQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2';
      expect(validateAddress(uqAddress)).toBe(true);
    });
  });

  describe('calculateTimeout', () => {
    it('should convert hours to seconds', () => {
      expect(calculateTimeout(1)).toBe(3600);
      expect(calculateTimeout(24)).toBe(86400);
      expect(calculateTimeout(0.5)).toBe(1800);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      const formatted = formatCurrency(100, 'USD');
      expect(formatted).toContain('100');
    });

    it('should format EUR correctly', () => {
      const formatted = formatCurrency(50.50, 'EUR');
      expect(formatted).toContain('50');
    });
  });

  describe('generateTradeId', () => {
    it('should generate unique trade IDs', () => {
      const id1 = generateTradeId();
      const id2 = generateTradeId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1.startsWith('TR')).toBe(true);
    });
  });

  describe('isValidPaymentMethod', () => {
    it('should validate correct payment methods', () => {
      expect(isValidPaymentMethod('PayPal')).toBe(true);
      expect(isValidPaymentMethod('Bank Transfer')).toBe(true);
      expect(isValidPaymentMethod('Wise')).toBe(true);
    });

    it('should reject invalid payment methods', () => {
      expect(isValidPaymentMethod('InvalidMethod')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isValidPaymentMethod('paypal')).toBe(true);
      expect(isValidPaymentMethod('WISE')).toBe(true);
    });
  });

  describe('calculateFee', () => {
    it('should calculate fee with default percentage', () => {
      expect(calculateFee(100)).toBe(0.5);
      expect(calculateFee(1000)).toBe(5);
    });

    it('should calculate fee with custom percentage', () => {
      expect(calculateFee(100, 1)).toBe(1);
      expect(calculateFee(100, 2.5)).toBe(2.5);
    });
  });
});

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(3, 1000); // 3 requests per second
  });

  it('should allow requests within limit', () => {
    expect(rateLimiter.checkLimit(123)).toBe(true);
    expect(rateLimiter.checkLimit(123)).toBe(true);
    expect(rateLimiter.checkLimit(123)).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    rateLimiter.checkLimit(123);
    rateLimiter.checkLimit(123);
    rateLimiter.checkLimit(123);
    expect(rateLimiter.checkLimit(123)).toBe(false);
  });

  it('should handle different users independently', () => {
    rateLimiter.checkLimit(123);
    rateLimiter.checkLimit(123);
    rateLimiter.checkLimit(123);
    
    expect(rateLimiter.checkLimit(123)).toBe(false);
    expect(rateLimiter.checkLimit(456)).toBe(true);
  });

  it('should reset user limits', () => {
    rateLimiter.checkLimit(123);
    rateLimiter.checkLimit(123);
    rateLimiter.checkLimit(123);
    
    expect(rateLimiter.checkLimit(123)).toBe(false);
    
    rateLimiter.reset(123);
    expect(rateLimiter.checkLimit(123)).toBe(true);
  });
});
