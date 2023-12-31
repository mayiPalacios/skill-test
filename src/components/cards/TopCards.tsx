import React, { useEffect, useState } from 'react';
import  { getPercentageChange} from '../../api/finnhubWebsocket';
import { IQuoteData, StockInfoProps } from '../../interfaces/InterfacesStock';

const TopCards: React.FC<StockInfoProps> = React.memo(({ symbol, alertValue, stockData }) => {
  const [dpPercentChange, setPercentChange] = useState<number | null>(() => {
    const storedDpValue = localStorage.getItem(`dpPercentChange_${symbol}`);
    return storedDpValue ? parseFloat(storedDpValue) : null;
  });
  
  useEffect(() => {
    const fetchPreviousClosePrice = async () => {
      const price:IQuoteData = await getPercentageChange(symbol);
      if(price != null){
        setPercentChange(price.dp);
        localStorage.setItem(`dpPercentChange_${symbol}`, price.dp.toString());
      }
    };

    fetchPreviousClosePrice();
  }, [stockData]);

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
