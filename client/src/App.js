import {useEffect, useState} from "react";
import { io } from "socket.io-client";
import './App.css';

const openWebsocket = () => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
        console.log("Połączono z websocketem!");
    })
    return socket;
};


function App() {
    const [page, setPage] = useState("default")
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        let socket = openWebsocket();
        setSocket(socket);
    }, [])


    const sendNickname = (nickname) => {
        socket.emit("create-nickname", nickname);
    }

  return (
    <div className="App">
        {page === "default" && (
            <>
            <h1>Projekt IO-4</h1>
            <button onClick={() => setPage("login")}>Login</button>
            </>
        )}

        {page === "login" && (
            <div className="login-block">
                <h1>Logowanie</h1>
                <input type="text" id="nickname"></input>
                <button onClick={() => {sendNickname(document.getElementById("nickname").value)}}>Login</button>
                <button onClick={() => setPage("default")}>Home</button>
            </div>
        )}


    </div>
  );
}

export default App;
