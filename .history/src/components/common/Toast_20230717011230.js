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
  border-radius: 1rem;
  background-color: white;
  padding: 1rem;
  bottom: 2rem;
  left: 1rem;
`;

const ToastText = styled.p`
  font-size: 1.6rem;
`;

export default Toast;
