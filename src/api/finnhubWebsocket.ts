const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const socket: WebSocket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

type DataCallback = (data: any, symbol: string) => void;

 export const getPercentageChange = async (symbol: string) => {
    const API_ENDPOINT = 'https://finnhub.io/api/v1';
    const response = await fetch(`${API_ENDPOINT}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const data = await response.json();
    
    return data.dp ? data : null; 
  };

export const subscribeToStock = (symbol: string, callback: DataCallback) => {
  
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'subscribe', symbol, event: 'quote' }));
  } else {
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'subscribe', symbol, event: 'quote' }));
    }, { once: true }); 
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data, symbol);
  };
};

export const unsubscribeFromStock = (symbol: string) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  };

socket.addEventListener('open', () => {
  console.log('Connected to Finnhub WebSocket');
});

socket.addEventListener('message', (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  console.log('Incoming data:', data);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from Finnhub WebSocket');
});

export default socket;
