import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/common/navigator/Navigator";
import PathWrite from "./pages/PathWrite";
import styled from "@emotion/styled";
import SideBar from "./components/common/sidebar/SideBar";
import { useState } from "react";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <PageWrapper>
      <SideBar isSideBarOpen={isSideBarOpen} />
      <ContentWarpper>
        <Navigator setIsSideBarOpen={setIsSideBarOpen} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write/:pathId" element={<PathWrite />} />
        </Routes>
      </ContentWarpper>
    </PageWrapper>
  );
}

export default App;

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  min-width: 60rem;
  background-color: #ededed;
`;
const ContentWarpper = styled.div`
  flex: 1;
  overflow: hidden;

  background-color: white;
  padding-left: 2.5rem;
  border-radius: 5rem 0 0 5rem;
`;