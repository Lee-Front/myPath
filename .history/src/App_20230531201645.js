import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navigator from "./components/common/navigator/Navigator";
import PathWrite from "./pages/PathWrite";
import styled from "@emotion/styled";
import SideBar from "./components/common/sidebar/SideBar";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [patList, setPathList] = useState([]);
  const userId = "wkdrmadl3";
  console.log("patList: ",.patList)

  const getPathList = async (userId) => {
    const response = await axios.get("/api/path/getList", {
      params: { userId },
    });
    console.log("response: ", response);
    setPathList(response.data);
  };
  useEffect(() => {
    getPathList(userId);
  }, []);

  return (
    <PageWrapper>
      <SideBar isSideBarOpen={isSideBarOpen} patList={patList} />
      <ContentWarpper>
        <Navigator setIsSideBarOpen={setIsSideBarOpen} />
        <Routes>
          <Route path="/" element={<Home patList={patList} />} />
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
  background-color: #ededed;
`;
const ContentWarpper = styled.div`
  flex: 1;
  overflow: hidden;
  background-color: white;
  padding-left: 2.5rem;
  border-radius: 5rem 0 0 5rem;
`;
