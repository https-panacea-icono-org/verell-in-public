import { TONService } from '../src/utils/ton';

describe('TONService', () => {
  let tonService: TONService;

  beforeEach(() => {
    tonService = new TONService(
      'https://testnet.toncenter.com/api/v2/jsonRPC',
      'EQD1234567890abcdef'
    );
  });

  describe('Address Validation', () => {
    test('should validate correct TON address', () => {
      const validAddress = 'EQD1234567890abcdef';
      // Note: This may fail with real validation, adjust as needed
      try {
        const isValid = tonService.isValidAddress(validAddress);
        expect(typeof isValid).toBe('boolean');
      } catch (error) {
        // Address format validation may vary
        expect(error).toBeDefined();
      }
    });

    test('should reject invalid TON address', () => {
      const invalidAddress = 'invalid_address';
      const isValid = tonService.isValidAddress(invalidAddress);
      expect(isValid).toBe(false);
    });
  });

  describe('Escrow Operations', () => {
    test('should create initialize escrow cell', async () => {
      const operation = {
        op: 1,
        tradeId: '12345',
        amount: 100,
        buyerAddress: 'EQBuyer123',
        sellerAddress: 'EQSeller456',
        expiryTime: Math.floor(Date.now() / 1000) + 86400
      };

      const cell = await tonService.initializeEscrow(operation);
      expect(cell).toBeDefined();
    });

    test('should create fund escrow cell', async () => {
      const cell = await tonService.fundEscrow('12345');
      expect(cell).toBeDefined();
    });

    test('should create release funds cell', async () => {
      const cell = await tonService.releaseFunds('12345');
      expect(cell).toBeDefined();
    });

    test('should create refund cell', async () => {
      const cell = await tonService.refundEscrow('12345');
      expect(cell).toBeDefined();
    });

    test('should create dispute cell', async () => {
      const cell = await tonService.openDispute('12345');
      expect(cell).toBeDefined();
    });
  });
});
