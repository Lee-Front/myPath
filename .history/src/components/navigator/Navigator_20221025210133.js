import React from "react";
import styled from "@emotion/styled";

const NavigatorWrapper = styled.div`
  width: 100%;
`;
const NavigatorSpan = styled.div`
  font-weight: 600;
  font-size: 3rem;
  padding: 1rem;
`;

const Navigator = () => {
  return (
    <NavigatorWrapper>
      <div>
        <NavigatorSpan>My Path</NavigatorSpan>
      </div>
    </NavigatorWrapper>
  );
};

export default Navigator;
