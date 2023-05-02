import React from "react";
import PathList from "../components/career/PathCard/PathList";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        paddingLeft: "4rem",
        paddingRight: "4rem",
      }}
    >
      <PathList />
    </div>
  );
};

export default Home;
