import React from "react";
import styled from "@emotion/styled";
import CardEditor from "../components/career/Editor/CardEditor";
import { useLocation, useParams } from "react-router-dom";

const AddPathWrapper = styled.div`
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const PathWrite = () => {
  const location = useLocation();
  console.log("location : ", location);
  return (
    <AddPathWrapper>
      <CardEditor />
    </AddPathWrapper>
  );
};

export default PathWrite;
