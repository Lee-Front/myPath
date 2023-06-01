import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/common/navigator/Navigator";
import PathDetail from "./pages/PathDetail";
import PathWrite from "./pages/PathWrite";
import styled from "@emotion/styled";
import SideBar from "./components/common/sidebar/SideBar";

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const ContentWarpper = styled.div`
  flex: 1;
  overflow: hidden;
`;

function App() {
  return (
    <PageWrapper>
      <SideBar />
      <Navigator />
      <ContentWarpper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write/:pathId" element={<PathWrite />} />
        </Routes>
      </ContentWarpper>
    </PageWrapper>
  );
}

export default App;
