import React from "react";
import styled from "@emotion/styled";

const Navigator = ({ setIsSideBarOpen }) => {
  return (
    <NavigatorWrapper>
      <BackButton
        onClick={() => {
          setIsSideBarOpen((prev) => !prev);
        }}
        src={process.env.PUBLIC_URL + "/images/hamburger.svg"}
        alt="hamburger button"
      />
      <NavigatorSpan>마이패스</NavigatorSpan>
    </NavigatorWrapper>
  );
};

export default Navigator;

const NavigatorWrapper = styled.div`
  width: 100%;
  display: flex;
  z-index: 1;
`;
const NavigatorSpan = styled.div`
  font-weight: 600;
  font-size: 3rem;
  flex: 1;
  padding: 2rem 1rem 2rem 1rem;
`;

const BackButton = styled.img`
  width: 2.5rem;
  fill: white;
  cursor: pointer;
`;
