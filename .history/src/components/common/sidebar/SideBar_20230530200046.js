import React from "react";
import styled from "@emotion/styled";

const SideBar = ({ isSideBarOpen }) => {
  return (
    <SideBarContainer isSideBarOpen={isSideBarOpen}>
      <Logo src={process.env.PUBLIC_URL + "/images/logo.svg"} alt="Logo" />
      <div>검색영역</div>
      <div>
        <div>카드1</div>
        <div>카드2</div>
      </div>
    </SideBarContainer>
  );
};

export default SideBar;

const SideBarContainer = styled.aside`
  width: ${(props) => (props.isSideBarOpen ? "20rem" : "0rem")};
  padding: 2rem;
  transition: width 0.3s;
`;

const Logo = styled.img``;
