import React, { useEffect, useState } from "react";
import { IQuoteData, IgraphProps, StockData } from "../../interfaces/InterfacesStock";
import { getPercentageChange, subscribeToStock, unsubscribeFromStock } from "../../api/finnhubWebsocket";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const StockChart: React.FC<IgraphProps> = ({symbols, stockData}) =>{
  const [formDataList, setFormDataList] = useState([
    { symbol: "", pc: 0, p: 0 },
  ]);
 

  useEffect(()=>{
    const fetchPreviousClosePrice = async (symbol: StockData) => {
      const price:IQuoteData = await getPercentageChange(symbol.symbol);
      if(price != null){
         const existingServiceIndex = formDataList.findIndex(item => item.symbol === symbol.symbol);
    if (existingServiceIndex >= 0) {
      const newList = [...formDataList];
      newList[existingServiceIndex] = { ...newList[existingServiceIndex], p: symbol.p };
      setFormDataList(newList);
    } else {
      setFormDataList([...formDataList, { symbol: symbol.symbol, pc: price.pc, p: symbol.p }]);
    }
      }
    };
    
    if (stockData.length > 0) {
      stockData.forEach((symb) => {
        if (symb !== null) {
          fetchPreviousClosePrice(symb);
        }
      });
    }
   
  },[stockData])

  const data = {
    labels: formDataList.map(item => item.symbol), 
    datasets: [
      {
        label: 'Precio de Cierre de Ayer (pc)',
        data: formDataList.map(item => item.pc),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Precio Actual (p)',
        data: formDataList.map(item => item.p),
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