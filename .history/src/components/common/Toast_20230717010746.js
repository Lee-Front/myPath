import React, { useEffect } from "react";

const Toast = ({ setToast, text }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(false);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);
  return (
    <div>
      <p>{text}</p>
    </div>
  );
};

export default Toast;
