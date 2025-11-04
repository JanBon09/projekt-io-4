import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import './App.css';
import {SocketProvider} from "./context/SocketContext";
import AnimatedRoutes from "./components/AnimatedRoutes/AnimatedRoutes";

function App() {

  return (
    <div className="App">
        <SocketProvider>
          <BrowserRouter>
            <AnimatedRoutes></AnimatedRoutes>
          </BrowserRouter>
        </SocketProvider>
    </div>
  );
}

export default App;
