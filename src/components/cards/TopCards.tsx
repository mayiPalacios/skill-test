import React, { useEffect, useRef, useState } from 'react';
import  { getPercentageChange} from '../../api/finnhubWebsocket';
import { FormDataType, IQuoteData, StockInfoProps } from '../../interfaces/InterfacesStock';
import { useFormDataList } from '../../context/FormDataListContext';
import { getToken } from 'firebase/messaging';
import messaging from '../../firebase/firebaseConfig';

const TopCards: React.FC<StockInfoProps> = React.memo(({ symbol, stockData }) => {
  const [dpPercentChange, setPercentChange] = useState<number | null>(() => {
    const storedDpValue = localStorage.getItem(`dpPercentChange_${symbol}`);
    return storedDpValue ? parseFloat(storedDpValue) : null;
  });
  const amount = localStorage.getItem("formDataList")
  const list = JSON.parse(amount!);
  let filteredItem = list.find((item: { service: string }) => item.service === symbol);
  
  const [storedSymbolData, setStoredSymbolData] = useState<FormDataType>(filteredItem);
  const { formDataList } = useFormDataList(); 
  const formDataForSymbol = formDataList.find(item => item.service === symbol);
  const priceAlertSentRef = useRef(false);
  // Referencia para recordar si el precio había subido por encima del umbral
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
  //  }



  async function sendNotificationIfPriceDrops() {
    // Asumimos que stockData y storedSymbolData están definidos y accesibles en este contexto
  
      
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: 'BIipSe3VSRzhWah0ASx95kQw2RSBG-JGAd8Nw2HrTOH3zYFh1nCC08I6vd7ono-XPOuUbDKzpQpWkFAB9KWmkNA',
          });
    
          fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAKJbMc3Y:APA91bFY_1_dmkx5czlxx_XdD1X3YyFEOeqfOpnJxiAl0WSvwyLEBQPKCnoLHNw4QwxfCI5628_MmuY2X6oLpjxBU_mNp0ZF6HHThfd5b6ygkPRwQMeIBLMwKSpJ5qS-2K0yvGQyI4mA'
            },
            body: JSON.stringify({
                notification: {
                    title: 'Alerta de Precio',
                    body: 'El precio ha caído por debajo del nivel de alerta'
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

  

  // useEffect(() => {
  //   sendNotificationIfPriceDrops();
  // }, [stockData]); 
//   let contador = 0;
//   const [probando, setprobando] = useState(0)
//   const [probando2, setprobando2] = useState(false)
//   let probando44 = true
//  if(stockData && formDataForSymbol ){
//   if( stockData.p <= parseInt(formDataForSymbol.amount)){
   
//    if(probando44){
//     probando44 = false
//    }
   
//   }else{
//     if(!probando44){
//       probando44 = false
//       console.log("paso al otro")
//     }
    
//   }
//  }else{

//  }

// Función para enviar la notificación



useEffect(() => {
  // Determina el valor actual del umbral de alerta
  const threshold = formDataForSymbol ? parseInt(formDataForSymbol.amount) : parseInt(storedSymbolData.amount);

  // Verifica si el precio actual es menor o igual al umbral
  if (stockData!.p <= threshold) {
    // Si no se ha enviado la alerta, o si el precio estaba por encima del umbral y luego cayó
    if (!priceAlertSentRef.current || priceAboveThresholdRef.current) {
      sendNotificationIfPriceDrops();
      priceAlertSentRef.current = true; // Marca que la alerta ha sido enviada
      priceAboveThresholdRef.current = false; // Reinicia la referencia de precio por encima del umbral
    }
  } else {
    // Si el precio sube por encima del umbral, reinicia la alerta enviada y marca que el precio está por encima del umbral
    priceAlertSentRef.current = false;
    priceAboveThresholdRef.current = true;
  }
}, [stockData!.p, formDataForSymbol, storedSymbolData.amount]); // Asegúrate de que el efecto se ejecute solo cuando estos valores cambien

// ... JSX y el resto de tu componente ...



  
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
