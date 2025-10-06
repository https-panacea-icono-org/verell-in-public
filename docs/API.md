# API Documentation

## REST API Endpoints

### Base URL
- Development: `http://localhost:3000`
- Production: TBD

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. List Orders

**GET** `/api/orders`

Get all active orders in the order book.

**Query Parameters:**
- `currency` (optional) - Filter by fiat currency (USD, EUR, etc.)
- `type` (optional) - Filter by order type (buy, sell)

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "userId": 123456789,
      "type": "buy",
      "cryptoAmount": 10.5,
      "fiatAmount": 100,
      "fiatCurrency": "USD",
      "paymentMethods": ["PayPal"],
      "price": 9.52,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. List Trades

**GET** `/api/trades`

Get all trades (active and historical).

**Query Parameters:**
- `userId` (optional) - Filter by user ID
- `status` (optional) - Filter by trade status

**Response:**
```json
{
  "trades": [
    {
      "id": "uuid",
      "orderId": "uuid",
      "buyerId": 123456789,
      "sellerId": 987654321,
      "cryptoAmount": 10.5,
      "fiatAmount": 100,
      "fiatCurrency": "USD",
      "paymentMethod": "PayPal",
      "status": "escrow_funded",
      "escrowAddress": "EQD...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:10:00.000Z",
      "timeout": 3600
    }
  ]
}
```

---

## Telegram Bot API

The bot communicates with users through Telegram's Bot API.

### Commands

#### /start
Initialize bot interaction and show welcome message.

#### /help
Display help information and command list.

#### /buy <amount> <currency> <price> <payment_method>
Create a buy order.

**Example:**
```
/buy 100 USD 2.5 PayPal
```
Creates order to buy $100 worth of TON at $2.5/TON using PayPal.

#### /sell <amount_ton> <currency> <price> <payment_method>
Create a sell order.

**Example:**
```
/sell 50 USD 2.5 Bank Transfer
```
Creates order to sell 50 TON at $2.5/TON accepting Bank Transfer.

#### /orders
List all available orders in the marketplace.

#### /mytrades
Show user's active trades with current status.

#### /wallet
Display wallet connection information and instructions.

#### /cancel
Cancel a pending order or trade.

---

## Smart Contract Interface

### Escrow Contract

#### Messages (Tact)

**InitEscrow**
```tact
message InitEscrow {
    seller: Address;
    tradeId: Int as uint64;
    timeout: Int as uint64;
}
```

**ReleaseFunds**
```tact
message ReleaseFunds {
    tradeId: Int as uint64;
}
```

**CancelTrade**
```tact
message CancelTrade {
    tradeId: Int as uint64;
}
```

**OpenDispute**
```tact
message OpenDispute {
    tradeId: Int as uint64;
}
```

#### Get Methods

**getEscrowData()**

Returns the current state of the escrow contract.

**Returns:**
```
(Address buyer, Address seller, Int amount, Int tradeId, Int status, Int createdAt, Int timeout)
```

**Status Values:**
- 0: Pending
- 1: Completed
- 2: Disputed
- 3: Cancelled

---

## Operations (FunC)

The FunC implementation uses operation codes:

- **op: 1** - Initialize escrow
- **op: 2** - Release funds to seller
- **op: 3** - Cancel and refund to buyer
- **op: 4** - Open dispute

---

## Error Codes

### Smart Contract Errors

- `401` - Only buyer can release funds
- `402` - Trade not in pending status for release
- `403` - Only buyer or timeout can cancel
- `404` - Trade not in pending status for cancel
- `405` - Only buyer or seller can open dispute
- `406` - Trade not in pending status for dispute

### API Errors

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized
- `404` - Resource not found
- `429` - Too many requests (rate limited)
- `500` - Internal server error

---

## Rate Limiting

Default rate limits:
- 10 requests per minute per user
- Configurable via environment variables

**Headers:**
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Time until limit resets

---

## Webhooks

Future feature: Webhook notifications for trade events.

**Events:**
- `order.created`
- `order.matched`
- `trade.funded`
- `trade.payment_sent`
- `trade.completed`
- `trade.disputed`
- `trade.cancelled`

---

## Authentication

Currently, authentication is handled via Telegram user IDs. Future versions may include:
- API keys for external integrations
- OAuth for third-party applications
- Signature-based authentication for security

---

## SDK Support

### JavaScript/TypeScript

```typescript
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
});

// Interact with escrow contract
const escrowAddress = Address.parse('EQD...');
const result = await client.runMethod(escrowAddress, 'get_escrow_data');
```

---

## Examples

### Complete Trade Flow

```typescript
// 1. Create sell order
await bot.telegram.sendMessage(userId, '/sell 10 USD 2.5 PayPal');

// 2. Buyer accepts order
// Bot deploys escrow contract

// 3. Buyer funds escrow
await blockchain.sendTransaction(buyerWallet, escrowAddress, amount);

// 4. Seller receives fiat
// Seller confirms in bot

// 5. Buyer releases funds
await escrow.releaseFunds(tradeId);
```

### Query Order Book

```bash
curl http://localhost:3000/api/orders?currency=USD&type=sell
```

### Check Health

```bash
curl http://localhost:3000/health
```
