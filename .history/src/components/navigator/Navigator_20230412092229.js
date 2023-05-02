import React from "react";
import styled from "@emotion/styled";

const NavigatorWrapper = styled.div`
  width: 100%;
  background-color: #fde1a3;
`;
const NavigatorSpan = styled.div`
  font-weight: 600;
  font-size: 3rem;
  padding: 2rem 1rem 2rem 4rem;
`;

const Navigator = () => {
  return (
    <NavigatorWrapper>
      <NavigatorSpan>My Path</NavigatorSpan>
      <div>X</div>
    </NavigatorWrapper>
  );
};

export default Navigator;
