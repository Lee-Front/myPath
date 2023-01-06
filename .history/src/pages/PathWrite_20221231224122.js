import React from "react";
import styled from "@emotion/styled";
import CardEditor from "../components/career/Editor/CardEditor";
import { useParams } from "react-router-dom";

const AddPathWrapper = styled.div`
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const PathWrite = () => {
  const params = useParams();
  console.log("path : ", params);
  return (
    <AddPathWrapper>
      <CardEditor />
    </AddPathWrapper>
  );
};

export default PathWrite;
