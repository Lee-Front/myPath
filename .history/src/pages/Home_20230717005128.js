import React, { useEffect } from "react";
import PathList from "../components/career/PathCard/PathList";
import styled from "@emotion/styled";
import useEditorStore from "../stores/useEditorStore";
import usePathCardStore from "../stores/usePathCardStore";

const Home = () => {
  const editorStore = useEditorStore();
  const pathCardStore = usePathCardStore();
  useEffect(() => {
    editorStore.clear();
    pathCardStore.getPathList();
  }, []);
  return (
    <HomeContainer>
      <HomeTitle>안녕하세요</HomeTitle>
      <PathList />
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 4rem;
  padding-right: 4rem;
  overflow: hidden;
  flex: 1;
`;

const HomeTitle = styled.h1`
  min-width: 20rem;
  margin-top: 4rem;
  font-size: 4rem;
  border-bottom: 0.3rem solid #e9ecef;
`;
