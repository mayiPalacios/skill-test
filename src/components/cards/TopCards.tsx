import React, { useEffect, useState } from 'react';
import  { getPercentageChange, subscribeToStock, unsubscribeFromStock } from '../../api/finnhubWebsocket';
import { IQuoteData, StockData, StockInfoProps } from '../../interfaces/InterfacesStock';

const TopCards: React.FC<StockInfoProps> = React.memo(({ symbol, alertValue, stockData }) => {
  // const [stockData, setStockData] = useState<StockData | null>(null);
  const [dpPercentChange, setPercentChange] = useState<number | null>(null);
  const [socketUpdated, setSocketUpdated] = useState<number>(0);
  
  useEffect(() => {
    const fetchPreviousClosePrice = async () => {
      const price:IQuoteData = await getPercentageChange(symbol);
      if(price != null){
        setPercentChange(price.dp);
      }
    };

    // const handleData = (data: any) => {
    //   if (data.type === 'trade' && data.data[0].s === symbol) {
    //     setStockData({
    //       c: data.data[0].p,  
    //       dp: data.data[0].dp, 
    //     });
    //     setSocketUpdated((prev) => prev + 1);
    //   }
    // };

    fetchPreviousClosePrice();
    // subscribeToStock(symbol, handleData);
    // return () => {
    //   unsubscribeFromStock(symbol);
    // };
  }, [symbol]);

  if (stockData) {
    return (
    <div className={`card-top text-white`} style={{backgroundColor: "#222222"}}>
      <div className="card-body" >
        <div className="d-flex justify-content-between">
          <p className="card-title mb-0" style={{ fontSize: '0.9rem' }}>{symbol}</p>
          <span className={`badge rounded-pill align-self-start`}>
            {stockData.p} USD
          </span>
        </div>
        <div className={`d-flex ${stockData.p <= parseInt(alertValue) ? 'text-danger' : 'text-success'} `} style={{marginLeft: "42px"}}>
          <h5 className="mb-0">{dpPercentChange + "%"}</h5>
        </div>
      </div>
    </div>
    );
  } else {
    return <div>Loading...</div>;
  }

});

export default TopCards;
