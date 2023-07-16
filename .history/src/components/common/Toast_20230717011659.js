import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const Toast = ({ setToast, text }) => {
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(false);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);
  return (
    <ToastContainer
      isShow={isShow}
      onAnimationEnd={() => {
        console.log("isShow : ", isShow);
      }}
    >
      <ToastText>{text}</ToastText>
    </ToastContainer>
  );
};
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: absolute;
  border-radius: 1rem;
  background-color: #d8d8d8;
  padding: 1rem;
  bottom: 2rem;
  left: 1rem;
  animation: ${(props) => (props.isShow ? fadeIn : fadeOut)} 0.5s ease-in-out;
`;

const ToastText = styled.p`
  font-size: 1.6rem;
`;

export default Toast;
