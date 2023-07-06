import React from "react";
import styled from "@emotion/styled";

const TextMenuButton = ({ isActive, buttonType, onClick, children }) => {
  return (
    <TextMenu isActive={isActive} onClick={onClick}>
      <TextMenuSpan bold={true} buttonType={buttonType}>
        {children}
      </TextMenuSpan>
    </TextMenu>
  );
};

export default TextMenuButton;

const TextMenu = styled.div`
  position: relative;
  min-width: 4rem;
  padding: 0 0.5rem;
  height: 4rem;
  display: flex;
  text-align: center;
  font-size: 1.5rem;

  flex-direction: column;
  justify-content: center;

  border: ${(props) =>
    props.isActive ? "0.2rem solid rgba(55, 53, 47, 0.2)" : null};

  border-radius: 0.3rem;
  :hover {
    background: rgba(55, 53, 47, 0.1);
    border-radius: 0.3rem;
  }
`;

const TextMenuSpan = styled.span`
  font-weight: ${(props) => (props.buttonType === "bold" ? "bold" : "")};
  font-style: ${(props) => (props.buttonType === "italic" ? "italic" : "")};
  text-decoration: ${(props) =>
    props.buttonType === "under-line" ? "underline" : ""};
  text-decoration: ${(props) =>
    props.buttonType === "line-through" ? "line-through" : ""};
`;