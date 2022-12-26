import React from "react";
import PathList from "../components/career/PathList";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      <PathList cardType="vertical" />
    </div>
  );
};

export default Home;
