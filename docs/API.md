# Verell P2P DEX - API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. In production, you should add API key authentication or OAuth.

## Endpoints

### Health Check

Check if the API is running.

**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Orders

#### Get Active Orders

Get all active buy/sell orders.

**GET** `/api/orders`

**Query Parameters:**
- `type` (optional): Filter by order type (`buy` or `sell`)

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "userId": 12345,
      "type": "sell",
      "currency": "USD",
      "cryptoCurrency": "TON",
      "amount": 100,
      "price": 2.5,
      "minAmount": 10,
      "maxAmount": 100,
      "paymentMethods": ["Bank Transfer", "PayPal"],
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Order

Create a new buy or sell order.

**POST** `/api/orders`

**Request Body:**
```json
{
  "userId": 12345,
  "type": "sell",
  "currency": "USD",
  "cryptoCurrency": "TON",
  "amount": 100,
  "price": 2.5,
  "paymentMethods": ["Bank Transfer"],
  "minAmount": 10,
  "maxAmount": 100
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "userId": 12345,
    "type": "sell",
    "currency": "USD",
    "cryptoCurrency": "TON",
    "amount": 100,
    "price": 2.5,
    "minAmount": 10,
    "maxAmount": 100,
    "paymentMethods": ["Bank Transfer"],
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Specific Order

Get details of a specific order.

**GET** `/api/orders/:orderId`

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "userId": 12345,
    "type": "sell",
    "currency": "USD",
    "cryptoCurrency": "TON",
    "amount": 100,
    "price": 2.5,
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Cancel Order

Cancel an active order.

**DELETE** `/api/orders/:orderId`

**Response:**
```json
{
  "message": "Order cancelled successfully"
}
```

---

### Trades

#### Create Trade

Create a new trade from an order.

**POST** `/api/trades`

**Request Body:**
```json
{
  "orderId": "order-uuid",
  "buyerId": 12345,
  "sellerId": 67890,
  "amount": 100,
  "currency": "USD",
  "cryptoAmount": 40,
  "cryptoCurrency": "TON",
  "price": 2.5,
  "paymentMethod": "Bank Transfer"
}
```

**Response:**
```json
{
  "trade": {
    "id": "trade-uuid",
    "buyerId": 12345,
    "sellerId": 67890,
    "amount": 100,
    "currency": "USD",
    "cryptoAmount": 40,
    "cryptoCurrency": "TON",
    "price": 2.5,
    "status": "created",
    "paymentMethod": "Bank Transfer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### Get Trade Details

Get details of a specific trade.

**GET** `/api/trades/:tradeId`

**Response:**
```json
{
  "trade": {
    "id": "trade-uuid",
    "buyerId": 12345,
    "sellerId": 67890,
    "amount": 100,
    "currency": "USD",
    "cryptoAmount": 40,
    "cryptoCurrency": "TON",
    "price": 2.5,
    "status": "funded",
    "paymentMethod": "Bank Transfer",
    "escrowAddress": "EQEscrow...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### Get User Trades

Get all trades for a specific user.

**GET** `/api/users/:userId/trades`

**Response:**
```json
{
  "trades": [
    {
      "id": "trade-uuid",
      "buyerId": 12345,
      "sellerId": 67890,
      "amount": 100,
      "currency": "USD",
      "cryptoAmount": 40,
      "cryptoCurrency": "TON",
      "price": 2.5,
      "status": "pending_payment",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update Trade Status

Update the status of a trade.

**PUT** `/api/trades/:tradeId/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Possible statuses:**
- `created`
- `funded`
- `pending_payment`
- `payment_sent`
- `completed`
- `disputed`
- `cancelled`
- `expired`

**Response:**
```json
{
  "message": "Trade status updated successfully"
}
```

#### Set Escrow Address

Set the escrow contract address for a trade.

**PUT** `/api/trades/:tradeId/escrow`

**Request Body:**
```json
{
  "escrowAddress": "EQEscrow..."
}
```

**Response:**
```json
{
  "message": "Escrow address set successfully"
}
```

---

### Escrow

#### Get Escrow Data

Get data from an escrow smart contract.

**GET** `/api/escrow/:address`

**Response:**
```json
{
  "data": {
    "buyerAddress": "EQBuyer...",
    "sellerAddress": "EQSeller...",
    "amount": "100000000000",
    "status": 1,
    "tradeId": "12345",
    "expiryTime": 1704153600
  }
}
```

**Escrow Status Codes:**
- `0`: Created
- `1`: Funded
- `2`: Completed
- `3`: Disputed
- `4`: Cancelled

---

### Wallet

#### Get Wallet Balance

Get the balance of a TON wallet.

**GET** `/api/wallet/:address/balance`

**Response:**
```json
{
  "balance": "1000000000"
}
```

Note: Balance is returned in nanotons (1 TON = 1,000,000,000 nanotons)

#### Validate TON Address

Check if a TON address is valid.

**POST** `/api/wallet/validate`

**Request Body:**
```json
{
  "address": "EQD..."
}
```

**Response:**
```json
{
  "valid": true
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `400`: Bad Request - Invalid input
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server error

## Rate Limiting

Currently, there is no rate limiting. For production, implement rate limiting to prevent abuse.

## Webhooks

Webhooks are not currently implemented but can be added to notify clients of trade status changes.

## Examples

### Complete Trade Flow

1. **Seller creates order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 12345,
    "type": "sell",
    "currency": "USD",
    "cryptoCurrency": "TON",
    "amount": 100,
    "price": 2.5,
    "paymentMethods": ["Bank Transfer"]
  }'
```

2. **Buyer creates trade:**
```bash
curl -X POST http://localhost:3000/api/trades \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-uuid",
    "buyerId": 67890,
    "sellerId": 12345,
    "amount": 100,
    "currency": "USD",
    "cryptoAmount": 40,
    "cryptoCurrency": "TON",
    "price": 2.5,
    "paymentMethod": "Bank Transfer"
  }'
```

3. **Check trade status:**
```bash
curl http://localhost:3000/api/trades/trade-uuid
```

4. **Complete trade:**
```bash
curl -X PUT http://localhost:3000/api/trades/trade-uuid/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```
