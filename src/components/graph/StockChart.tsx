import React, { useEffect, useState } from "react";
import { IQuoteData, IStockDataGraph, IgraphProps, StockData } from "../../interfaces/InterfacesStock";
import { getPercentageChange} from "../../api/finnhubWebsocket";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const StockChart: React.FC<IgraphProps> = ({stockData}) =>{
  const [formDataList, setFormDataList] = useState(() => {
    const dataFromStorage = localStorage.getItem('websocketGraph');
    return dataFromStorage ? JSON.parse(dataFromStorage) : [];
  });

 const fetchPreviousClosePrice = async (symbol: StockData) => {
  const price: IQuoteData = await getPercentageChange(symbol.symbol);
  if (price != null) {
    setFormDataList((currentDataList: IStockDataGraph[]) => {
      const existingServiceIndex = currentDataList.findIndex(item => item.symbol === symbol.symbol);
      let newDataList;

      if (existingServiceIndex >= 0) {
        newDataList = [...currentDataList];
        newDataList[existingServiceIndex] = { ...newDataList[existingServiceIndex], pc: price.pc, p: symbol.p };
      } else {
        newDataList = [...currentDataList, { symbol: symbol.symbol, pc: price.pc, p: symbol.p }];
      }

      localStorage.setItem('websocketGraph', JSON.stringify(newDataList));
      return newDataList; 
    });
  }
};

  useEffect(()=>{
    if (stockData.length > 0) {
      stockData.forEach((symb) => {
        if (symb !== null) {
          fetchPreviousClosePrice(symb);
        }
      });
    }
   
  },[stockData])

  
  const data = {
    labels: formDataList.map((item: { symbol: string }) => item.symbol), 
    datasets: [
      {
        label: 'Precio de Cierre de Ayer (pc)',
        data: formDataList.map((item: { pc: number })  => item.pc),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Precio Actual (p)',
        data: formDataList.map((item: { p: number }) => item.p),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

    return(
        <div>
            <Line data={data} />
        </div>
    )
}

export default StockChart