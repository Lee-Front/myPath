import React from "react";
import styled from "@emotion/styled";
import CardEditor from "../components/career/Editor/CardEditor";

const AddPathWrapper = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 1rem;
  transition: 0.5s;
  overflow: hidden;
`;

const PathWrite = () => {
  return (
    <AddPathWrapper>
      <CardEditor />
    </AddPathWrapper>
  );
};

export default PathWrite;
