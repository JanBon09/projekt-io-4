import {useEffect, useState} from "react";
import {BrowserRouter, Routes, Route, Navigation} from "react-router-dom";
import './App.css';
import LoginPage from "./pages/LoginPage/LoginPage";
import TestPage from "./pages/TestPage/TestPage";
import {SocketProvider} from "./context/SocketContext";
import SelectPage from "./pages/SelectPage/SelectPage";



function App() {
    const [page, setPage] = useState("default")


  return (
    <div className="App">
        <SocketProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/select" element={<SelectPage />} />
              </Routes>
          </BrowserRouter>
        </SocketProvider>
    </div>
  );
}

export default App;
