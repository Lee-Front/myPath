import React, { useEffect } from "react";
import styled from "@emotion/styled";

const Toast = ({ setToast, text }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      //setToast(false);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);
  return (
    <ToastContainer>
      <ToastText>{text}</ToastText>
    </ToastContainer>
  );
};

const ToastContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const ToastText = styled.p`
  font-size: 1.7rem;
`;

export default Toast;
