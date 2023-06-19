import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/common/navigator/Navigator";
import PathWrite from "./pages/PathWrite";
import styled from "@emotion/styled";
import SideBar from "./components/common/sidebar/SideBar";
import { useState } from "react";
import { isMobile } from "react-device-detect";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  // 모바일은 읽기 모드만 지원해줄 예정
  console.log("isMobile: ", isMobile);

  return (
    <PageWrapper>
      <SideBar isSideBarOpen={isSideBarOpen} />
      <Navigator setIsSideBarOpen={setIsSideBarOpen} />
      <ContentWarpper isSideBarOpen={isSideBarOpen}>
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
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 32rem;
  background-color: #ededed;
`;
const ContentWarpper = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  flex: 1;
  background-color: white;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  border-radius: 5rem 0 0 5rem;
`;
