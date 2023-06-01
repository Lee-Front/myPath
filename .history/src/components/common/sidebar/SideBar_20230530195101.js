import React from "react";
import styled from "@emotion/styled";

const SideBar = ({ isSideBarOpen }) => {
  return (
    <SideBarContainer isSideBarOpen={isSideBarOpen}>
      <div>검색영역</div>
      <div>
        <div></div>
      </div>
    </SideBarContainer>
  );
};

export default SideBar;

const SideBarContainer = styled.aside`
  width: ${(props) => (props.isSideBarOpen ? "20rem" : "0rem")};
  transition: width 0.3s;
`;
