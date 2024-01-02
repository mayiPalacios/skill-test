import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import TopCards from "../cards/TopCards";

const LeftForm = () => {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [formDataList, setFormDataList] = useState([
    { service: "", amount: "" },
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const existingServiceIndex = formDataList.findIndex(item => item.service === service);
  
    if (existingServiceIndex >= 0) {
      const newList = [...formDataList];
      newList[existingServiceIndex] = { ...newList[existingServiceIndex], amount: amount };
      setFormDataList(newList);
    } else {
      setFormDataList([...formDataList, { service: service, amount: amount }]);
    }
  };

  return (
    <div>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <div className="row">
          {formDataList.map(
            (formData, index) =>
              formData.service !== "" && (
                <div className="col-3 mb-3" key={index}>
                  <TopCards symbol={formData.service} alertValue={amount} />
                </div>
              )
          )}
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

      <div className="col-md-8">{/* Componente del gráfico aquí */}</div>
    </div>
  );
};

export default LeftForm;
