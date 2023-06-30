import React from "react";
import PathList from "../components/career/PathCard/PathList";
import styled from "@emotion/styled";

const Home = () => {
  return (
    <HomeContainer>
      <HomeTitle>안녕하세요</HomeTitle>
      <PathList />
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  padding-left: 4rem;
  padding-right: 4rem;
`;

const HomeTitle = styled.h1`
  font-size: 4rem;
  border-bottom: 0.3rem solid #e9ecef;
`;