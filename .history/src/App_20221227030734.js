import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/navigator/Navigator";
import PathDetail from "./pages/PathDetail";
import PathWrite from "./pages/PathWrite";

function App() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Navigator />
      <Routes>
        <Route path="/" element={<Home />} />
          
          <Route path="write" element={<PathWrite />} />
          <Route path="/pathDetail" element={<PathDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
