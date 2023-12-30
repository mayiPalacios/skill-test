import { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import TopCards from "../cards/TopCards";
import { IQuoteData, StockData } from "../../interfaces/InterfacesStock";
import {
  getPercentageChange,
  subscribeToStock,
  unsubscribeFromStock,
} from "../../api/finnhubWebsocket";
import StockChart from "../graph/StockChart";

const LeftForm = () => {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [formDataList, setFormDataList] = useState([
    { service: "", amount: "" },
  ]);
  const [stockData, setStockData] = useState<(StockData | null)[]>([]);
  const [previousValue, setPreviousValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchPreviousClosePrice = async (symbol: string) => {
      const price: IQuoteData = await getPercentageChange(symbol);
      if (price != null) {
        setPreviousValue(price.pc);
      }
    };

    //  const handleData = (data: any, symbol: string) => {
    //    console.log(data)
    //    const existData = stockData.findIndex(item => item?.symbol === symbol);

    //    if(existData >= 0){
    //     const newListData = [...stockData];
    //     newListData[existData] = {...newListData[existData], data }
    //    }
    //    if (data.type === 'trade' && data.data[0].s === symbol) {

    //      setStockData((prevData) => [...prevData, data]);
    //    }
    //  };

    const handleData = (data: any, symbol: any) => {
      console.log("handleData data", data);
      console.log("handleData symbol", data.data[0]?.s);

      const newData = { symbol, p: data.data[0].p };
      const existDataIndex = stockData.findIndex(
        (item) => item?.symbol === data.data[0]?.s
      );
      if (existDataIndex !== -1) {
        // Update the existing item
        const updatedStockData = stockData.map((item) =>
          item?.symbol === data.data[0]?.s ? newData : item
        );
        setStockData(updatedStockData);
      } else {
        // Add the new item
        setStockData([...stockData, newData]);
      }
    };

    // console.log(data.data[0].p);
    // const existDataIndex = stockData.findIndex(item => item?.symbol === symbol);

    // if (existDataIndex >= 0) {
    //   const updatedStockData = stockData.map((item, index) =>
    //     index === existDataIndex ? { ...item, p: data.data[0].p } : item
    //   );
    //   setStockData(updatedStockData);
    // } else {
    //   const newData: StockData = { symbol, p: data.data[0].p };
    //   setStockData([...stockData, newData]);
    // }

    formDataList.forEach((symbol) => {
      fetchPreviousClosePrice(symbol.service);
    });

    formDataList.forEach((symbol) => {
      subscribeToStock(symbol.service, handleData);
    });

    return () => {
      formDataList.forEach((symbol) => {
        unsubscribeFromStock(symbol.service);
      });
    };
  }, [formDataList]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const existingServiceIndex = formDataList.findIndex(
      (item) => item.service === service
    );
    if (existingServiceIndex >= 0) {
      const newList = [...formDataList];
      newList[existingServiceIndex] = {
        ...newList[existingServiceIndex],
        amount: amount,
      };
      setFormDataList(newList);
    } else {
      setFormDataList([...formDataList, { service: service, amount: amount }]);
    }
  };

  return (
    <div>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <div className="row">
          {stockData &&
            stockData.map((data, index) => (
              <div className="col-3 mb-3" key={index}>
                <TopCards
                  symbol={data!.symbol}
                  alertValue={amount}
                  stockData={data}
                />
              </div>
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
          symbols={formDataList.map((formData) => formData.service)}
          stockData={stockData}
        />
      </div>
    </div>
  );
};

export default LeftForm;
