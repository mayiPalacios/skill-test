import { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import TopCards from "../cards/TopCards";
import { ApiResponse, FormDataType, StockData } from "../../interfaces/InterfacesStock";
import {
  subscribeToStock,
  unsubscribeFromStock,
} from "../../api/finnhubWebsocket";
import StockChart from "../graph/StockChart";
import { useFormDataList } from "../../context/FormDataListContext";

const LeftForm = () => {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const { setFormDataList } = useFormDataList();
  const [lefFormDataList, setLefFormDataList] = useState<FormDataType[]>(() => {
    const dataFromStorage = localStorage.getItem("formDataList");

    if (dataFromStorage) {
      return JSON.parse(dataFromStorage);
    }

    return [{ service: "", amount: "" }];
  });
  const [stockData, setStockData] = useState<StockData[]>(() => {
    const localData = localStorage.getItem("websocket");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    const handleData = (data: ApiResponse) => {
      console.log("cambiate:",data)
      const stockDataUpdate = {
        symbol: data.data[0]?.s,
        p: data.data[0]?.p,
        alertValue: amount,
      };

      const currentDataRaw = localStorage.getItem("websocket");
      const currentData = currentDataRaw ? JSON.parse(currentDataRaw) : [];
      const dataIndex = currentData.findIndex(
        (item: { symbol: string }) => item.symbol === stockDataUpdate.symbol
      );

      if (dataIndex !== -1) {
        currentData[dataIndex] = stockDataUpdate;
      } else {
        currentData.push(stockDataUpdate);
      }

      localStorage.setItem("websocket", JSON.stringify(currentData));
      setStockData(currentData);
    };

    lefFormDataList.forEach((formItem) => {
      if (formItem.service) {
        subscribeToStock(formItem.service, handleData);
      }
    });

    return () => {
      lefFormDataList.forEach((formItem) => {
        if (formItem.service) {
          unsubscribeFromStock(formItem.service);
        }
      });
    };
  }, [lefFormDataList]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLefFormDataList((currentDataList) => {
      const existingServiceIndex = currentDataList.findIndex(
        (item) => item.service === service
      );

      let newDataList;

      if (existingServiceIndex >= 0) {
        newDataList = [...currentDataList];
        newDataList[existingServiceIndex] = {
          ...newDataList[existingServiceIndex],
          amount: amount,
        };
      } else {
        newDataList = [
          ...currentDataList,
          { service: service, amount: amount },
        ];
      }

      localStorage.setItem("formDataList", JSON.stringify(newDataList));
      setFormDataList(newDataList);

      return newDataList;
    });
  };

  const numCardsToShowWithoutScroll = 4;
  const shouldScroll = stockData.length > numCardsToShowWithoutScroll;
  
  return (
    <div>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <div
          className={`row-query row ${shouldScroll ? "row-scrollable " : ""}`}
        >
          {stockData &&
            stockData.map(
              (data) =>
                data && (
                  <div
                    className={`card-container-component ${
                      shouldScroll ? "col-3" : "col-3"
                    }`}
                    key={data.symbol}
                  >
                    <TopCards symbol={data.symbol} stockData={data} />
                  </div>
                )
            )}
        </div>
      </div>

      <div style={{ marginTop: "120px" }}>
        <Card
          className="card-form-container"
          style={{ backgroundColor: "rgb(34, 34, 34)" }}
        >
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex gap-2 form-container">
                <Form.Group>
                  <Form.Label style={{ color: "white" }}>
                    Select Stock Service:
                  </Form.Label>
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
                  <Form.Label style={{ color: "white" }}>
                    Enter Stop-Loss Price: ($):
                  </Form.Label>
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
                    borderColor: "green",
                    backgroundColor: "green",
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
        <StockChart stockData={stockData} />
      </div>
    </div>
  );
};

export default LeftForm;
