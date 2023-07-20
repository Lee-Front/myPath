import React, { useEffect } from "react";

const useTextStyler = () => {
  useEffect(() => {
    console.log("a");
  });
  return { a: 1, b: 2 };
};

export default useTextStyler;
