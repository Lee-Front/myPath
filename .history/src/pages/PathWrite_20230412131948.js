import React from "react";
import CardEditor from "../components/career/Editor/CardEditor";
import { useLocation } from "react-router-dom";

const PathWrite = () => {
  const location = useLocation();
  return <CardEditor pathId={location.state.pathId} />;
};

export default PathWrite;
