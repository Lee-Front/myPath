import React from "react";
import styled from "@emotion/styled";

const NavigatorWrapper = styled.div`
  width: 100%;
  background-color: #fde1a3;
  display: flex;
`;
const NavigatorSpan = styled.div`
  font-weight: 600;
  font-size: 3rem;
  padding: 2rem 1rem 2rem 4rem;
`;

const BackButton = styled.div`
  width: 5rem;
  height: 100%;
  text-align: center;
  font-size: 20rem;
  color: white;
  ::before {
    cursor: pointer;
    content: "<";
  }
`;

const Navigator = () => {
  return (
    <NavigatorWrapper>
      <BackButton></BackButton>
      <NavigatorSpan>My Path</NavigatorSpan>
    </NavigatorWrapper>
  );
};

export default Navigator;
