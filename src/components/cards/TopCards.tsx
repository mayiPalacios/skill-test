import React, { useEffect, useState } from 'react';
import socket, { getPercentageChange, subscribeToStock, unsubscribeFromStock } from '../../api/finnhubWebsocket';
import { StockData, StockInfoProps } from '../../interfaces/InterfacesStock';

const TopCards: React.FC<StockInfoProps> = ({ symbol, alertValue }) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [previousClosePrice, setPreviousClosePrice] = useState<number | null>(null);
  const [socketUpdated, setSocketUpdated] = useState<number>(0);

  useEffect(() => {
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
    <div className={`card-top text-white`} style={{backgroundColor: "#222222"}}>
      <div className="card-body" >
        <div className="d-flex justify-content-between">
          <p className="card-title mb-0" style={{ fontSize: '0.9rem' }}>{symbol}</p>
          <span className={`badge rounded-pill align-self-start`}>
            {stockData.c} USD
          </span>
        </div>
        <div className={`d-flex ${stockData.c <= parseInt(alertValue) ? 'text-danger' : 'text-success'} `} style={{marginLeft: "42px"}}>
          <h5 className="mb-0">{previousClosePrice + "%"}</h5>
        </div>
      </div>
    </div>
    );
  } else {
    return <div>Loading...</div>;
  }

};

export default TopCards;
