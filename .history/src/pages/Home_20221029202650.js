import React from "react";
import PathList from "../components/career/PathList";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        marginLeft: "4rem",
        marginRight: "4rem",
      }}
    >
      <PathList />
    </div>
  );
};

export default Home;
