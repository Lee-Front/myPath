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
  background-color: #343a40;
  bottom: 2rem;
  left: 2;
`;

const ToastText = styled.p`
  font-size: 1.6rem;
`;

export default Toast;
