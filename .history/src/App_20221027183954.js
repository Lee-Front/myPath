import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/navigator/Navigator";
import PathDetail from "./pages/PathDetail";

function App() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Navigator />
      <Routes>
        <Route index to="/" element={<Home />} />
        <Route index to="/pathDetail" element={<PathDetail />} />
      </Routes>
    </div>
  );
}

export default App;
