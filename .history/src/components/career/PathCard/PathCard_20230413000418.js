import React from "react";
import styled from "@emotion/react";

const PathCardWrapper = styled.div`
  width: ${(props) => `calc(100% / ${props.columnCount} - 1rem)`};
  min-height: 15rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0 0.5rem;
  cursor: pointer;
  background: white;
`;

const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  margin: 1rem;
  word-break: break-all;
`;

const PathCard = () => {
  return (
    <PathCardWrapper
      columnCount={cardColumn}
      key={path.pathId}
      onClick={() => {
        moveWritePage(path.pathId);
      }}
    >
      <PathCardTitle>{path.title}</PathCardTitle>
    </PathCardWrapper>
  );
};

export default PathCard;
