export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    dividendYield: number;
    logo?: string; // Optional for UI
}

export const marketData: Stock[] = [
    {
        symbol: "SCOM",
        name: "Safaricom PLC",
        price: 17.85,
        change: 0.25,
        changePercent: 1.42,
        volume: 12500000,
        dividendYield: 0.065,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Safaricom_Logo.svg/1200px-Safaricom_Logo.svg.png"
    },
    {
        symbol: "EQTY",
        name: "Equity Group Holdings",
        price: 41.20,
        change: -0.80,
        changePercent: -1.90,
        volume: 5400000,
        dividendYield: 0.075,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Equity_Group_Holdings_Limited_logo.svg/1200px-Equity_Group_Holdings_Limited_logo.svg.png"
    },
    {
        symbol: "KCB",
        name: "KCB Group",
        price: 22.10,
        change: 0.10,
        changePercent: 0.45,
        volume: 3200000,
        dividendYield: 0.082,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/36/KCB_Group_logo.svg/1200px-KCB_Group_logo.svg.png"
    },
    {
        symbol: "EABL",
        name: "East African Breweries",
        price: 145.00,
        change: 2.50,
        changePercent: 1.75,
        volume: 950000,
        dividendYield: 0.045,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/East_African_Breweries_Limited_logo.svg/1200px-East_African_Breweries_Limited_logo.svg.png"
    }
];
