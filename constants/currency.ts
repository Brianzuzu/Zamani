export const formatCurrency = (amount: number, currency: string, symbol: string) => {
    return `${symbol} ${amount.toLocaleString()}`;
};

export const convertCurrency = (amount: number, from: string, to: string) => {
    // Mock rates
    const rates: { [key: string]: number } = {
        'KES_USD': 1/129,
        'USD_KES': 129,
        'KES_CAD': 1/100,
        'CAD_KES': 100,
        'KES_GBP': 1/165,
        'GBP_KES': 165,
        'KES_EUR': 1/140,
        'EUR_KES': 140,
        'KES_AED': 1/35,
        'AED_KES': 35,
        'KES_ZAR': 1/6.8,
        'ZAR_KES': 6.8,
        'KES_UGX': 28,
        'UGX_KES': 1/28,
        'KES_TZS': 19,
        'TZS_KES': 1/19,
    };
    
    const key = `${from}_${to}`;
    if (from === to) return amount;
    if (rates[key]) return amount * rates[key];
    return amount;
};

export const parsePrice = (p: any): number => {
    if (!p) return 0;
    if (typeof p === 'number') return p;
    const s = p.toString().toUpperCase();
    let val = parseFloat(s.replace(/[^0-9.]/g, ""));
    if (s.includes('M')) val *= 1000000;
    else if (s.includes('K')) val *= 1000;
    return val;
};
