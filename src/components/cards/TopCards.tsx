import React, { useEffect, useRef, useState } from 'react';
import  { getPercentageChange} from '../../api/finnhubWebsocket';
import { FormDataType, IQuoteData, StockInfoProps } from '../../interfaces/InterfacesStock';
import { useFormDataList } from '../../context/FormDataListContext';
import { getToken } from 'firebase/messaging';
import messaging from '../../firebase/firebaseConfig';

const TopCards: React.FC<StockInfoProps> = React.memo(({ symbol, stockData }) => {
  const [dpPercentChange, setPercentChange] = useState<number | string>(() => {
    const storedDpValue = localStorage.getItem(`dpPercentChange_${symbol}`);
    return storedDpValue ? parseFloat(storedDpValue) : "loading";
  });
  const amount = localStorage.getItem("formDataList")
  const list = JSON.parse(amount!);
  let filteredItem = list.find((item: { service: string }) => item.service === symbol);
  
  const [storedSymbolData, setStoredSymbolData] = useState<FormDataType>(filteredItem);
  const { formDataList } = useFormDataList(); 
  const formDataForSymbol = formDataList.find(item => item.service === symbol);
  const priceAlertSentRef = useRef(false);
  const priceAboveThresholdRef = useRef(false);

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
  
  async function sendNotificationIfPriceDrops(symbol: string) {
   
        const permission = await Notification.requestPermission();
           
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
          });
    
          fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${import.meta.env.VITE_APP_AUTHORIZATION_KEY}`
            },
            body: JSON.stringify({
                notification: {
                    title: `${symbol} price Alert`,
                    body: 'The price has fallen below the alert level'
                },
                to: token
            }),
        });
          console.log("Token generated : ", token);
          localStorage.setItem("tokenFinnhub", token);
        } else if (permission === "denied") {
          alert("You denied for the notification");
        }   
  }

  useEffect(() => {
    const threshold = formDataForSymbol ? parseInt(formDataForSymbol.amount) : parseInt(storedSymbolData.amount);
    
    if (stockData!.p <= threshold) {
     
      if (!priceAlertSentRef.current || priceAboveThresholdRef.current) {
        
        sendNotificationIfPriceDrops(stockData!.symbol);
        priceAlertSentRef.current = true; 
        priceAboveThresholdRef.current = false;
      }
    } else {
      priceAlertSentRef.current = false;
      priceAboveThresholdRef.current = true;
    }
  }, [stockData!.p, formDataForSymbol, storedSymbolData.amount]); 

  if (stockData) {
      if (formDataForSymbol) { 
        return (
          <div className={`card-top text-white`} style={{backgroundColor: "#222222"}}>
            <div className="card-body" >
              <div className="d-flex justify-content-between">
                <p className="card-title mb-0" style={{ fontSize: '0.9rem' }}>{symbol}</p>
                <span className={`badge rounded-pill align-self-start`}>
                  {stockData.p} USD
                </span>
              </div>
              <div className={`d-flex ${stockData.p <= parseInt(formDataForSymbol.amount) ? 'text-danger' : 'text-success'} `} style={{marginLeft: "42px"}}>
                <h5 className="mb-0">{dpPercentChange + "%"}</h5>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className={`card-top text-white`} style={{backgroundColor: "#222222"}}>
          <div className="card-body" >
            <div className="d-flex justify-content-between">
              <p className="card-title mb-0" style={{ fontSize: '0.9rem' }}>{symbol}</p>
              <span className={`badge rounded-pill align-self-start`}>
                {stockData.p} USD
              </span>
            </div>
            <div className={`d-flex ${stockData.p <= parseInt(storedSymbolData.amount) ? 'text-danger' : 'text-success'} `} style={{marginLeft: "42px"}}>
              <h5 className="mb-0">{dpPercentChange + "%"}</h5>
            </div>
          </div>
        </div>
        )
      }
  } else {
    return <div>Loading...</div>;
  }
  
});

export default TopCards;
