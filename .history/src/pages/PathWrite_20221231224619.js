import React from "react";
import styled from "@emotion/styled";
import CardEditor from "../components/career/Editor/CardEditor";
import { useLocation } from "react-router-dom";

const AddPathWrapper = styled.div`
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const PathWrite = () => {
  const location = useLocation();
  return (
    <AddPathWrapper>
      <CardEditor pathId={location.state.pathId} />
    </AddPathWrapper>
  );
};

export default PathWrite;
