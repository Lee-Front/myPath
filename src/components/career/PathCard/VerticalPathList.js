import React from "react";
import PathList from "./PathList";
import styled from "@emotion/styled";

const VerticalPathWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 2rem 4rem;
`;

const VerticalPathScroll = styled.div`
  overflow-y: scroll;
`;

const VerticalPathList = () => {
  return (
    <VerticalPathWrapper>
      <VerticalPathScroll>
        <PathList />
      </VerticalPathScroll>
    </VerticalPathWrapper>
  );
};

export default VerticalPathList;
