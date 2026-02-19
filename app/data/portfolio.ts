export interface Holding {
    symbol: string;
    shares: number;
    avgBuyPrice: number;
    currentPrice: number;
    gain?: number;
    gainPercent?: number;
}

export interface Portfolio {
    totalInvested: number;
    currentValue: number;
    totalGain: number;
    holdings: Holding[];
}

export const userPortfolio: Portfolio = {
    totalInvested: 150000,
    currentValue: 162500,
    totalGain: 12500,
    holdings: [
        {
            symbol: "SCOM",
            shares: 3000,
            avgBuyPrice: 16.50,
            currentPrice: 17.85,
            gain: 4050,
            gainPercent: 8.18
        },
        {
            symbol: "EQTY",
            shares: 500,
            avgBuyPrice: 39.00,
            currentPrice: 41.20,
            gain: 1100,
            gainPercent: 5.64
        }
    ]
};
