import {useState} from "react";
import { io } from "socket.io-client";

const openWebsocket = () => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
        console.log("Połączono z websocketem!");
    })
};


function App() {
    const [page, setPage] = useState("default")



  return (
    <div className="App">
        <h1>test</h1>
        {page === "default" && (
            <>
            <h1>Projekt IO-4</h1>
            <button onClick={() => setPage("login")}>Login</button>
            </>
        )}

        {page === "login" && (
            <>
                <h1>Logowanie</h1>
                <input type="text"></input>
                <button onClick={() => openWebsocket()}>Login</button>
                <button onClick={() => setPage("default")}>Home</button>
            </>
        )}


    </div>
  );
}

export default App;
