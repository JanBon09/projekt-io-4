import './App.css';
import {SocketProvider} from "./context/SocketContext";
import AnimatedRoutes from "./components/AnimatedRoutes/AnimatedRoutes";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
      <div className="App">
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
          <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
                rel="stylesheet"/>
          <SocketProvider>
              <BrowserRouter>
                  <AnimatedRoutes></AnimatedRoutes>
              </BrowserRouter>
          </SocketProvider>
      </div>
  );
}

export default App;
