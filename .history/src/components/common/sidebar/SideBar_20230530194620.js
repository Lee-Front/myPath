import React from "react";
import styled from "@emotion/styled";

const SideBar = ({ isSideBarOpen }) => {
  console.log("isSideBarOpen: ", isSideBarOpen);
  return <SideBarContainer></SideBarContainer>;
};

export default SideBar;

const SideBarContainer = styled.aside`
  width: {isSideBarOpen ? 20rem : 0rem};
`;
