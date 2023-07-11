import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const PathCard = ({
  pathData,
  isHover,
  setContextMenuData,
  contextMenuData,
  setIsContextMenu,
}) => {
  const nav = useNavigate();
  return (
    <PathCardContainer onClick={() => nav("/write/" + pathData._id)}>
      <PathCardTitle>{pathData.title}</PathCardTitle>
      {isHover && (
        <PathCardOptionWrapper
          onClick={(e) => {
            e.stopPropagation();
            setContextMenuData({
              pathId: pathData._id,
              x: e.clientX,
              y: e.clientY,
            });

            if (contextMenuData.pathId === pathData._id) {
              setIsContextMenu((prev) => !prev);
            } else {
              setIsContextMenu(true);
            }
          }}
        >
          <PathCarOptionImg
            src={`${process.env.PUBLIC_URL}/images/optionDots.svg`}
          />
        </PathCardOptionWrapper>
      )}
    </PathCardContainer>
  );
};

export default PathCard;

const PathCardContainer = styled.div`
  position: relative;
  height: 100%;
  border-radius: 0.5rem;
  min-height: 15rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  background: white;
`;

const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  margin: 1rem;
  white-space: break-spaces;
`;

const PathCardOptionWrapper = styled.div`
  position: absolute;
  padding: 0.5rem;
  right: 0.5rem;
  top: 1rem;
  width: 1.5rem;
  height: 3rem;
  border-radius: 0.5rem;
  :hover {
    background: rgba(55, 53, 47, 0.1);
  }
`;

const PathCarOptionImg = styled.img`
  width: 100%;
  height: 100%;
`;
