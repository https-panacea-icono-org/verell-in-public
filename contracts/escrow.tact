#pragma version >=0.2.0;

import "@stdlib/deploy";

message InitEscrow {
    seller: Address;
    tradeId: Int as uint64;
    timeout: Int as uint64;
}

message ReleaseFunds {
    tradeId: Int as uint64;
}

message CancelTrade {
    tradeId: Int as uint64;
}

message OpenDispute {
    tradeId: Int as uint64;
}

contract EscrowContract with Deployable {
    buyer: Address;
    seller: Address;
    amount: Int as coins;
    tradeId: Int as uint64;
    status: Int as uint8;  // 0: pending, 1: completed, 2: disputed, 3: cancelled
    createdAt: Int as uint64;
    timeout: Int as uint64;

    init() {
        self.buyer = newAddress(0, 0);
        self.seller = newAddress(0, 0);
        self.amount = 0;
        self.tradeId = 0;
        self.status = 0;
        self.createdAt = 0;
        self.timeout = 0;
    }

    receive(msg: InitEscrow) {
        require(self.status == 0, "Already initialized");
        self.buyer = sender();
        self.seller = msg.seller;
        self.amount = context().value;
        self.tradeId = msg.tradeId;
        self.status = 0;
        self.createdAt = now();
        self.timeout = msg.timeout;
    }

    receive(msg: ReleaseFunds) {
        require(sender() == self.buyer, "Only buyer can release funds");
        require(self.status == 0, "Trade not pending");
        require(msg.tradeId == self.tradeId, "Invalid trade ID");
        
        send(SendParameters{
            to: self.seller,
            value: self.amount,
            mode: SendRemainingValue,
            body: "Trade completed".asComment()
        });
        
        self.status = 1;
    }

    receive(msg: CancelTrade) {
        let isTimeout: Bool = now() > self.createdAt + self.timeout;
        require(sender() == self.buyer || isTimeout, "Only buyer or timeout can cancel");
        require(self.status == 0, "Trade not pending");
        require(msg.tradeId == self.tradeId, "Invalid trade ID");
        
        send(SendParameters{
            to: self.buyer,
            value: self.amount,
            mode: SendRemainingValue,
            body: "Trade cancelled".asComment()
        });
        
        self.status = 3;
    }

    receive(msg: OpenDispute) {
        require(sender() == self.buyer || sender() == self.seller, "Only buyer or seller can open dispute");
        require(self.status == 0, "Trade not pending");
        require(msg.tradeId == self.tradeId, "Invalid trade ID");
        
        self.status = 2;
    }

    get fun getEscrowData(): (Address, Address, Int, Int, Int, Int, Int) {
        return (self.buyer, self.seller, self.amount, self.tradeId, self.status, self.createdAt, self.timeout);
    }
}
