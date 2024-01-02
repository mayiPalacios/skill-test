import { useEffect } from 'react';
import StockData from './pages/StockData'
import { getToken } from "firebase/messaging";
import messaging from './firebase/firebaseConfig';

function App() {

  // async function requestPermission() {
   
  // }

  // useEffect(() => {
  //   requestPermission();
  // }, []);

  return (
    <>
     <StockData />
    </>
  )
}

export default App