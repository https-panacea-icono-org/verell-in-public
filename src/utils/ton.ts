import { Address, Cell, beginCell, toNano } from '@ton/core';
import { TonClient } from '@ton/ton';
import { EscrowOperation } from '../types';

export class TONService {
  private client: TonClient;
  private escrowAddress?: Address;

  constructor(endpoint: string, escrowAddress: string) {
    this.client = new TonClient({ endpoint });
    if (escrowAddress) {
      this.escrowAddress = Address.parse(escrowAddress);
    }
  }

  /**
   * Initialize a new escrow for a trade
   */
  async initializeEscrow(operation: EscrowOperation): Promise<Cell> {
    const body = beginCell()
      .storeUint(1, 32) // op: initialize
      .storeAddress(Address.parse(operation.buyerAddress))
      .storeAddress(Address.parse(operation.sellerAddress))
      .storeCoins(toNano(operation.amount))
      .storeUint(BigInt(operation.tradeId), 64)
      .storeUint(operation.expiryTime, 32)
      .endCell();

    return body;
  }

  /**
   * Fund escrow (buyer sends funds)
   */
  async fundEscrow(_tradeId: string): Promise<Cell> {
    const body = beginCell()
      .storeUint(2, 32) // op: fund
      .endCell();

    return body;
  }

  /**
   * Release funds to seller
   */
  async releaseFunds(_tradeId: string): Promise<Cell> {
    const body = beginCell()
      .storeUint(3, 32) // op: release
      .endCell();

    return body;
  }

  /**
   * Refund to buyer
   */
  async refundEscrow(_tradeId: string): Promise<Cell> {
    const body = beginCell()
      .storeUint(4, 32) // op: refund
      .endCell();

    return body;
  }

  /**
   * Open dispute
   */
  async openDispute(_tradeId: string): Promise<Cell> {
    const body = beginCell()
      .storeUint(5, 32) // op: dispute
      .endCell();

    return body;
  }

  /**
   * Get escrow data
   */
  async getEscrowData(escrowAddress: string): Promise<{
    buyerAddress: Address;
    sellerAddress: Address;
    amount: bigint;
    status: number;
    tradeId: bigint;
    expiryTime: number;
  }> {
    try {
      const address = Address.parse(escrowAddress);
      const result = await this.client.runMethod(address, 'get_escrow_data');
      
      return {
        buyerAddress: result.stack.readAddress(),
        sellerAddress: result.stack.readAddress(),
        amount: result.stack.readBigNumber(),
        status: result.stack.readNumber(),
        tradeId: result.stack.readBigNumber(),
        expiryTime: result.stack.readNumber()
      };
    } catch (error) {
      console.error('Error fetching escrow data:', error);
      throw error;
    }
  }

  /**
   * Check if address is valid
   */
  isValidAddress(address: string): boolean {
    try {
      Address.parse(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(address: string): Promise<bigint> {
    try {
      const addr = Address.parse(address);
      const balance = await this.client.getBalance(addr);
      return balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }
}
