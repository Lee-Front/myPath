import React from "react";
import styled from "@emotion/styled";

const ContextMenuWarpper = styled.div`
  z-index: 999;
`;

const ContextMenuPopup = ({ pointer }) => {
  console.log(pointer);
  return <ContextMenuWarpper>123123</ContextMenuWarpper>;
};

export default ContextMenuPopup;
