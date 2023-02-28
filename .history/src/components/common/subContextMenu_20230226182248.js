import React from "react";
import { useState } from "react";

const SubContextMenu = () => {
  const [isSelect, setIsSelect] = useState(false);
  return (
    <div>
      <div>
        정렬
        <span style={{ float: "right", paddingRight: "1rem" }}>&gt;</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: "-6rem",
          top: 0,
          background: "white",
          border: "1px solid rgba(55, 53, 47, 0.2)",
          borderRadius: "0.5rem",
        }}
      >
        <div>왼쪽</div>
        <div>가운데</div>
        <div>오른쪽</div>
      </div>
    </div>
  );
};

export default SubContextMenu;
