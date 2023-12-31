import { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import TopCards from "../cards/TopCards";
import { FormDataType, IQuoteData, StockData } from "../../interfaces/InterfacesStock";
import {
  getPercentageChange,
  subscribeToStock,
  unsubscribeFromStock,
} from "../../api/finnhubWebsocket";
import StockChart from "../graph/StockChart";

const LeftForm = () => {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [formDataList, setFormDataList] = useState<FormDataType[]>(() => {
    // Intentar obtener los datos de localStorage
    const dataFromStorage = localStorage.getItem('formDataList');
  
    // Si existen datos, parsearlos y usarlos como estado inicial
    if (dataFromStorage) {
      return JSON.parse(dataFromStorage);
    }
  
    // Si no hay datos en localStorage, usar un valor inicial por defecto
    return [{ service: "", amount: "" }];
  });
  const [stockData, setStockData] = useState<StockData[]>(() => {
    const localData = localStorage.getItem('websocket');
    return localData ? JSON.parse(localData) : [];
  });
  const [previousValue, setPreviousValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchPreviousClosePrice = async (symbol: string) => {
      const price: IQuoteData = await getPercentageChange(symbol);
      if (price != null) {
        setPreviousValue(price.pc);
      }
    };

    const handleData = (data: any, symbol: any) => {
      // console.log("handleData data", data);
      // console.log("handleData symbol", data.data[0]?.s);
      

      const stockDataUpdate = { symbol: data.data[0]?.s , p: data.data[0]?.p };

      const currentDataRaw = localStorage.getItem('websocket');
      const currentData = currentDataRaw ? JSON.parse(currentDataRaw) : [];
      const dataIndex = currentData.findIndex((item: { symbol: string; }) => item.symbol === stockDataUpdate.symbol);

      if (dataIndex !== -1) {
        currentData[dataIndex] = stockDataUpdate;
      } else {
        currentData.push(stockDataUpdate);
      }

      localStorage.setItem('websocket', JSON.stringify(currentData));
      
      setStockData(currentData);
      // const newData = { symbol: data.data[0]?.s, p: data.data[0].p };
     
      

      // const existDataIndex = stockData.findIndex(
      //   (item) => item?.symbol === data.data[0]?.s
      // );
      // if (existDataIndex !== -1) {
      //   const updatedStockData = stockData.map((item) =>
      //     item?.symbol === data.data[0]?.s ? newData : item
      //   );
      //   setStockData(updatedStockData);
      // } else {
      //   setStockData([...stockData, newData]);
      // }
    };



    formDataList.forEach((symbol) => {
      fetchPreviousClosePrice(symbol.service);
    });

    formDataList.forEach((formItem) => {
      if (formItem.service) {
        subscribeToStock(formItem.service, handleData);
      }
    });
  

    return () => {
      formDataList.forEach((formItem) => {
        if (formItem.service) {
          unsubscribeFromStock(formItem.service);
        }
      });
    };
  }, [formDataList]);

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const existingServiceIndex = formDataList.findIndex(
  //     (item) => item.service === service
  //   );
  //   if (existingServiceIndex >= 0) {
  //     const newList = [...formDataList];
  //     newList[existingServiceIndex] = {
  //       ...newList[existingServiceIndex],
  //       amount: amount,
  //     };
  //     setFormDataList(newList);
  //   } else {
  //     setFormDataList([...formDataList, { service: service, amount: amount }]);
  //   }
  // };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormDataList(currentDataList => {
      // Buscar si ya existe un elemento con el mismo valor 'service'
      const existingServiceIndex = currentDataList.findIndex(
        (item) => item.service === service
      );
  
      let newDataList;
  
      if (existingServiceIndex >= 0) {
        // Si existe, actualizar este elemento
        newDataList = [...currentDataList];
        newDataList[existingServiceIndex] = {
          ...newDataList[existingServiceIndex],
          amount: amount,
        };
      } else {
        // Si no existe, agregar el nuevo elemento
        newDataList = [...currentDataList, { service: service, amount: amount }];
      }
  
      // Actualizar localStorage con la nueva lista
      localStorage.setItem('formDataList', JSON.stringify(newDataList));
  
      return newDataList; // Actualiza formDataList
    });
  };
  console.log(stockData)

  return (
    <div>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
      <div className="row">
  {stockData &&
    stockData.map((data) => (
      data && (
        <div className="col-3 mb-3" key={data.symbol}> 
          <TopCards
            symbol={data.symbol}
            alertValue={amount}
            stockData={data}
          />
        </div>
      )
    ))}
</div>
      </div>
      <div style={{ marginTop: "100px" }}>
        <Card style={{ width: "42rem" }}>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex gap-2">
                <Form.Group>
                  <Form.Label>Select Financial Service:</Form.Label>
                  <Form.Control
                    as="select"
                    name="financialService"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    <option value="">Choose...</option>
                    <option value="BINANCE:ADAUSDT">BINANCE:ADAUSDT</option>
                    <option value="BINANCE:DOTUSDT">BINANCE:DOTUSDT</option>
                    <option value="BINANCE:SOLUSDT">BINANCE:SOLUSDT </option>
                    <option value="BINANCE:LINKUSDT">BINANCE:LINKUSDT</option>
                    <option value="BINANCE:BTCUSDT">BINANCE:BTCUSDT</option>
                    <option value="BINANCE:ETHUSDT">BINANCE:ETHUSDT</option>
                    <option value="BINANCE:BNBUSDT">BINANCE:BNBUSDT</option>
                    <option value="BINANCE:XRPUSDT">BINANCE:XRPUSDT</option>
                    <option value="BINANCE:LTCUSDT">BINANCE:LTCUSDT</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Enter Amount ($):</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    width: "100px",
                    height: "36px",
                    padding: "5px",
                    marginTop: "32px",
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-8">
        <StockChart
          stockData={stockData}
        />
      </div>
    </div>
  );
};

export default LeftForm;
