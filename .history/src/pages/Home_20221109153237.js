import { Howl } from "howler";
import React from "react";
import PathList from "../components/career/PathCard/PathList";

const Home = () => {
  var sound = new Howl({
    src: "http://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    autoplay: true,
    loop: true,
    volume: 0.5,
  });

  sound.play();
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
