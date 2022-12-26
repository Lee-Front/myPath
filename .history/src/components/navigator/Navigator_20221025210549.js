import React from "react";
import styled from "@emotion/styled";

const NavigatorWrapper = styled.div`
  width: 100%;
  background-color: #f9fcec;
`;
const NavigatorSpan = styled.div`
  font-weight: 600;
  font-size: 3rem;
  padding: 2rem 1rem 2rem 4rem;
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
