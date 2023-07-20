import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/common/navigator/Navigator";
import PathWrite from "./pages/PathWrite";
import styled from "@emotion/styled";
import SideBar from "./components/common/sidebar/SideBar";
import { useEffect, useState } from "react";
import usePathCardStore from "./stores/usePathCardStore";
import Toast from "./components/common/Toast";
import { isMobile } from "react-device-detect";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const location = useLocation();
  const pathCardStore = usePathCardStore();
  const [toast, setToast] = useState(false);
  // 모바일은 읽기 모드만 지원해줄 예정
  useEffect(() => {
    if (isMobile) {
      setToast(true);
    }
  }, []);
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
        {toast && (
          <Toast setToast={setToast} text="모바일은 읽기전용 입니다." />
        )}
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
  //box-shadow: inset 0 0 0 0.1rem rgba(0, 0, 0, 0.3);
  border: 0.1rem solid rgba(0,0,0,0.3)
  border-radius: 3rem 0 0 3rem;
`;
