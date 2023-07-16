import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/common/navigator/Navigator";
import PathWrite from "./pages/PathWrite";
import styled from "@emotion/styled";
import SideBar from "./components/common/sidebar/SideBar";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import usePathCardStore from "./stores/usePathCardStore";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const location = useLocation();
  const pathCardStore = usePathCardStore();
  // 모바일은 읽기 모드만 지원해줄 예정
  useEffect(() => {
    pathCardStore.getPathList();
  }, [location]);

  return (
    <PageWrapper
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
    >
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
`;
const ContentWarpper = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  flex: 1;
  background-color: white;
  border-radius: 3.5rem 0 0 3.5rem;
`;
