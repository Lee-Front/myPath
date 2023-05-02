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
  height: 5rem;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  position: absolute;
  right: 2rem;
  top: 1.5rem;
  background: white;
  z-index: 999;
`;

const Navigator = () => {
  return (
    <NavigatorWrapper>
      <BackButton>"<"</BackButton>
      <NavigatorSpan>My Path</NavigatorSpan>
    </NavigatorWrapper>
  );
};

export default Navigator;
