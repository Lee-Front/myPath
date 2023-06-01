import React from "react";
import styled from "@emotion/styled";

const SideBar = ({ isSideBarOpen }) => {
  return <SideBarContainer isSideBarOpen={isSideBarOpen}></SideBarContainer>;
};

export default SideBar;

const SideBarContainer = styled.aside`
  width: ${(props) => (props.isSideBarOpen ? "20rem" : "0rem")};
`;
