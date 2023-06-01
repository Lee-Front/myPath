import React from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as LeftArrow } from "../../images/left-arrow.svg";

const NavigatorWrapper = styled.div`
  width: 100%;
  background-color: #fde1a3;
  display: flex;
`;
const NavigatorSpan = styled.div`
  font-weight: 600;
  font-size: 3rem;
  flex: 1;
  padding: 2rem 1rem 2rem 1rem;
`;

const BackButton = styled(LeftArrow)`
  width: 3rem;
  fill: white;
  padding-left: 1rem;
  cursor: pointer;
`;

const Navigator = () => {
  const nav = useNavigate();
  const location = useLocation();
  return (
    <NavigatorWrapper
      onClick={() => {
        if (location.pathname !== "/") nav(-1);
      }}
    >
      <BackButton />
      <NavigatorSpan>마이패스</NavigatorSpan>
    </NavigatorWrapper>
  );
};

export default Navigator;
