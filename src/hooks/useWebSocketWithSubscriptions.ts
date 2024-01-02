import { useEffect, useState, useCallback } from 'react';

const useWebSocketWithSubscriptions = (initialSymbols) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    const subscribe = useCallback((symbol) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'subscribe', symbol }));
        }
    }, [socket]);

    const unsubscribe = useCallback((symbol) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
        }
    }, [socket]);

    useEffect(() => {
        const newSocket = new WebSocket('wss://ws.finnhub.io?token=YOUR_API_KEY');

        newSocket.addEventListener('open', () => {
            initialSymbols.forEach(symbol => subscribe(symbol));
        });

        newSocket.addEventListener('message', (event) => {
            setMessages(prev => [...prev, event.data]);
        });

        setSocket(newSocket);

        return () => {
            initialSymbols.forEach(symbol => unsubscribe(symbol));
            newSocket.close();
        };
    }, [initialSymbols, subscribe, unsubscribe]);

    return { subscribe, unsubscribe, messages };
};

export default useWebSocketWithSubscriptions;
