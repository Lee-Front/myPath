import React from "react";
import PathList from "../components/career/PathCard/PathList";

const Home = () => {
  console.log("home");
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        paddingLeft: "4rem",
        paddingRight: "4rem",
      }}
    >
      <PathList />
    </div>
  );
};

export default Home;
