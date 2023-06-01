import React from "react";
import CardEditor from "../components/career/Editor/CardEditor";
import { useParams } from "react-router-dom";

const PathWrite = () => {
  const { id } = useParams();
  return <CardEditor id={id} />;
};

export default PathWrite;
