
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

export interface IStockDataGraph {
    symbol: string;
    pc: number;
    c: number;
}

export interface IgraphProps {
    stockData: (StockData | null)[];
}

export interface FormDataType {
    service: string;
    amount: string;
}