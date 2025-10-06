# Architecture Documentation

## Overview

Verell is a TON-native non-custodial P2P fiat-to-crypto DEX that operates entirely within Telegram, utilizing on-chain escrow smart contracts for secure trades.

## System Architecture

### Components

1. **Telegram Bot** - User interface and interaction layer
2. **Smart Contracts** - On-chain escrow and trade logic
3. **Backend API** - Order matching and trade management
4. **TON Blockchain** - Settlement and escrow layer

### Architecture Diagram

```
┌─────────────────┐
│  Telegram User  │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Telegram Bot   │
│  (Node.js/TS)   │
└────────┬────────┘
         │
         v
┌─────────────────┐         ┌──────────────────┐
│  Order Book &   │◄────────►│  TON Blockchain  │
│  Trade Manager  │         │  (Smart Contracts)│
└─────────────────┘         └──────────────────┘
```

## Smart Contract Architecture

### Escrow Contract

The escrow contract is written in both FunC and Tact for maximum compatibility.

**Key Features:**
- Holds buyer's TON during trade
- Supports release, cancel, and dispute operations
- Time-based automatic refunds
- On-chain state verification

**Operations:**
1. **Initialize** (op: 1) - Create escrow with buyer, seller, and timeout
2. **Release** (op: 2) - Buyer releases funds to seller
3. **Cancel** (op: 3) - Buyer or timeout cancels trade
4. **Dispute** (op: 4) - Either party opens dispute

**State:**
```
- buyer_address: Address
- seller_address: Address  
- amount: Coins
- trade_id: uint64
- status: uint8 (0=pending, 1=completed, 2=disputed, 3=cancelled)
- created_at: uint64
- timeout: uint64
```

## Backend Services

### OrderBook Service

Manages buy and sell orders:
- Maintains in-memory order book
- Matches compatible orders
- Filters by currency and payment method

### TradeManager Service

Handles trade lifecycle:
- Creates trades from matched orders
- Updates trade status
- Tracks active and historical trades

### BlockchainService

Interacts with TON blockchain:
- Deploys escrow contracts
- Sends transactions
- Queries contract state
- Monitors transaction history

## Security Considerations

### Non-Custodial Design
- Users retain full control of their private keys
- No central authority holds funds
- Smart contract enforces trade rules

### Escrow Protection
- Funds locked in smart contract during trade
- Time-based automatic refunds prevent indefinite locks
- Dispute mechanism for conflict resolution

### Rate Limiting
- Prevents spam and abuse
- Per-user request limits
- Configurable thresholds

## Trade Flow

### Complete Trade Lifecycle

1. **Order Creation**
   - User creates buy/sell order via Telegram
   - Order added to order book
   - Matches against existing orders

2. **Order Acceptance**
   - Counter-party accepts order
   - Trade object created
   - Escrow contract deployed

3. **Escrow Funding**
   - Buyer sends TON to escrow contract
   - Contract verifies and locks funds
   - Status: ESCROW_FUNDED

4. **Fiat Payment**
   - Seller provides payment details
   - Buyer sends fiat payment
   - Buyer marks payment as sent
   - Status: PAYMENT_SENT

5. **Payment Confirmation**
   - Seller confirms fiat receipt
   - Status: PAYMENT_CONFIRMED

6. **Fund Release**
   - Buyer releases escrow funds
   - Smart contract sends TON to seller
   - Status: COMPLETED

### Dispute Flow

1. Either party opens dispute
2. Both parties provide evidence
3. Admin/arbitrator reviews case
4. Decision enforced on-chain
5. Funds distributed per resolution

## Data Models

See `src/types/index.ts` for complete type definitions:

- **User** - Telegram user with wallet and reputation
- **Order** - Buy/sell order with price and limits
- **Trade** - Active trade between two users
- **EscrowData** - On-chain escrow contract state
- **Dispute** - Dispute case with resolution

## API Endpoints

### Health Check
```
GET /health
Returns: { status: 'ok', timestamp: ISO-8601 }
```

### List Orders
```
GET /api/orders
Returns: { orders: Order[] }
```

### List Trades
```
GET /api/trades
Returns: { trades: Trade[] }
```

## Telegram Commands

- `/start` - Welcome and introduction
- `/help` - Detailed help information
- `/buy <amount> <currency> <price> <method>` - Create buy order
- `/sell <amount> <currency> <price> <method>` - Create sell order
- `/orders` - List available orders
- `/mytrades` - View user's active trades
- `/wallet` - Wallet management info
- `/cancel` - Cancel order or trade

## Future Enhancements

1. **Persistent Storage** - Database for orders and trades
2. **Reputation System** - User ratings and feedback
3. **Multi-currency Support** - More fiat currencies
4. **Advanced Matching** - Better order matching algorithm
5. **Mobile App** - Native mobile application
6. **DeFi Integration** - Liquidity pools and staking
7. **Analytics Dashboard** - Trading statistics and insights
8. **KYC/AML** - Optional identity verification
9. **Escrow Arbitration** - Decentralized dispute resolution
10. **Fee Distribution** - Revenue sharing with stakeholders
