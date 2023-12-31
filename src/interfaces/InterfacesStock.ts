export interface StockInfoProps {
  symbol: string;
  stockData: StockData | null;
}

export interface StockData {
  symbol: string;
  p: number;
}

export interface IStockDataList {
  c: number | null; 
  p: number; 
  s: string; 
  t: number; 
  v: number;
}

export interface ApiResponse {
  data: IStockDataList[];
}

export interface ICardStockData {
  symbol: string;
  p: number;
  dp: number;
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
  p: number;
}

export interface IgraphProps {
  stockData: (StockData | null)[];
}

export interface FormDataType {
  service: string;
  amount: string;
}

export interface SymbolDpPair {
  symbol: string;
  dp: number | null;
}
