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
      <ContentWarpper isSideBarOpen={isSideBarOpen}>
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
  position: relative;
  height: 100%;
  display: flex;
  min-width: 32rem;
  background-color: #ededed;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
`;
const ContentWarpper = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  flex: 1;
  background-color: white;

  border-radius: 5rem 0 0 5rem;
`;
