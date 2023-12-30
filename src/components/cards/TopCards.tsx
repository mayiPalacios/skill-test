import React, { useEffect, useState } from 'react';
import socket, { getPercentageChange, subscribeToStock, unsubscribeFromStock } from '../../api/finnhubWebsocket';

export interface StockInfoProps {
  symbol: string;
}
  
  interface StockData {
    c: number; // Precio actual
    dp: number; // Cambio porcentual diario
  }

const TopCards: React.FC<StockInfoProps> = ({ symbol }) => {
  // Estado para almacenar los datos de la acción
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [previousClosePrice, setPreviousClosePrice] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [socketUpdated, setSocketUpdated] = useState<number>(0);

  useEffect(() => {
    // Define el manejador de datos
    const fetchPreviousClosePrice = async () => {
      const price = await getPercentageChange(symbol);
      if(price != null){
        setPreviousClosePrice(price);
      }
    
    };

    const handleData = (data: any) => {
      if (data.type === 'trade' && data.data[0].s === symbol) {
        setStockData({
          c: data.data[0].p,  
          dp: data.data[0].dp, 
        });
        setSocketUpdated((prev) => prev + 1);
      }
    };
     
    fetchPreviousClosePrice();
    subscribeToStock(symbol, handleData);

    return () => {
      unsubscribeFromStock(symbol);
    };
  }, [symbol, socketUpdated]);

  if (stockData) {
    return (
      <div className={`card ${stockData.dp < 0 ? 'bg-danger' : 'bg-success'}`}>
        <div className="card-body">
          <h5 className="card-title">{symbol}</h5>
          <p className="card-text">
            {stockData.c} USD
          </p>
          <p className="card-text">
            {previousClosePrice + "%"}
          </p>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }

};

export default TopCards;
