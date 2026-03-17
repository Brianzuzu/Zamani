// Mock Trade Service

export interface TradeOrder {
    orderId: string;
    symbol: string;
    shares: number;
    price: number;
    type: "BUY" | "SELL";
    status: "Executed" | "Pending" | "Cancelled";
    timestamp: Date;
}

export const placeOrder = (symbol: string, shares: number, price: number, type: "BUY" | "SELL"): TradeOrder => {
    // In a real app, this would hit an API endpoint
    return {
        orderId: Math.random().toString(36).substring(7).toUpperCase(),
        symbol,
        shares,
        price,
        type,
        status: "Executed",
        timestamp: new Date()
    };
};

export interface Transaction {
    id: string;
    type: "BUY" | "SELL" | "DIVIDEND";
    symbol: string;
    shares?: number;
    price?: number;
    amount?: number; // Total value or dividend amount
    date: string;
}

export const transactionHistory: Transaction[] = [
    {
        id: "tx_1",
        type: "BUY",
        symbol: "SCOM",
        shares: 1000,
        price: 16.00,
        amount: 16000,
        date: "2026-01-10"
    },
    {
        id: "tx_2",
        type: "BUY",
        symbol: "EQTY",
        shares: 500,
        price: 39.00,
        amount: 19500,
        date: "2026-01-15"
    },
    {
        id: "tx_3",
        type: "DIVIDEND",
        symbol: "SCOM",
        amount: 4500,
        date: "2026-02-01"
    }
];

export const calculateDividend = (shares: number, dividendYield: number, price: number) => {
    return shares * price * dividendYield;
};
