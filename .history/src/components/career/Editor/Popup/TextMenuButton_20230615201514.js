import React from "react";
import styled from "@emotion/styled";

const TextMenuButton = ({ isActive, onMouseEnter, onClick, children }) => {
  return (
    <TextMenu onMouseEnter={onMouseEnter} isActive={isActive} onClick={onClick}>
      <TextMenuSpan bold={true}>{children}</TextMenuSpan>
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
  font-weight: ${(props) => (props.isActive === "bold" ? "bold" : "")};
  font-style: ${(props) => (props.isActive === "italic" ? "italic" : "")};
  text-decoration: ${(props) =>
    props.isActive === "under-line" ? "underline" : ""};
  text-decoration: ${(props) =>
    props.isActive === "line-through" ? "line-through" : ""};
`;
