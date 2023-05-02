import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/navigator/Navigator";
import PathDetail from "./pages/PathDetail";
import PathWrite from "./pages/PathWrite";
import styled from "@emotion/styled";

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
`;
const ContentWarpper = styled.div`
  flex: 1;
`;

function App() {
  return (
    <PageWrapper>
      <Navigator />
      <ContentWarpper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<PathWrite />} />
          <Route path="/pathDetail" element={<PathDetail />} />
        </Routes>
      </ContentWarpper>
    </PageWrapper>
  );
}

export default App;
