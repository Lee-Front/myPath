import React from "react";
import CardEditor from "../components/career/Editor/CardEditor";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";

const PathWrite = () => {
  const { pathId } = useParams();
  return (
    <PathWriteWrapper
      onMouseLeave={() => {
        console.log("lv");
      }}
      onMouseEnter={() => {
        console.log("en");
      }}
    >
      <CardEditor pathId={pathId} />
    </PathWriteWrapper>
  );
};

export default PathWrite;

const PathWriteWrapper = styled.div`
  height: 100%;
  overflow: auto;
  mouse-events: none;
`;
