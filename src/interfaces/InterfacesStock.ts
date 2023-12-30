
export interface StockInfoProps {
    symbol: string;
    alertValue: string;
    stockData: StockData | null;
}
    
export interface StockData {
    symbol: string;
    p: number;
}

export interface IStockDataList {
    p: number;
}

export interface IQuoteData {
    dp: number;
    pc: number;
}

export interface IStockDataContext {
    symbol: string;
    pc: number;
    c: number;
}

export interface IgraphProps {
    symbols: string[];
    stockData: (StockData | null)[];
}