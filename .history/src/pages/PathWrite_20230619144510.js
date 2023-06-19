import React from "react";
import CardEditor from "../components/career/Editor/CardEditor";
import { useParams } from "react-router-dom";

const PathWrite = () => {
  const { pathId } = useParams();
  return (
    <div>
      <CardEditor pathId={pathId} />
    </div>
  );
};

export default PathWrite;
