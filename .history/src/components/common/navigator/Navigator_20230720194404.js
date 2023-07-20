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
  display: flex;
  z-index: 1;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;
const NavigatorSpan = styled.span`
  font-weight: 600;
  font-size: 2.5rem;
  line-height: 2.5rem;
  flex: 1;
  padding: 2rem 1rem;
`;

const BackButton = styled.img`
  width: 2.2rem;
  fill: white;
  cursor: pointer;
`;
