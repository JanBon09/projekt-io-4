import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

let socketInstance = null;

const getSocketInstance = () => {
    if(!socketInstance) {
        socketInstance = io('http://localhost:3000', {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });
    }
    socketInstance.on("connect", () => {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            socketInstance.emit("create-nickname", savedUsername);
        }
    });
    return socketInstance;
}


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(()=>getSocketInstance());

    useEffect(() => {
       const currSocket = getSocketInstance();
        setSocket(currSocket);

        return () => {
            currSocket.off('connect');
            currSocket.off('disconnect');
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (socket === undefined) {
        throw new Error('Out of socket context scope');
    }
    return socket;
};