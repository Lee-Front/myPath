import React, { useRef } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import usePathCardStore from "../../../stores/usePathCardStore";

import { keyframes } from "@emotion/react";

const PathCard = ({ pathData, isHover, setIsContextMenu }) => {
  const nav = useNavigate();
  const pathCardStore = usePathCardStore();
  const inputRef = useRef(null);

  const handleEditSubmit = (e) => {
    e.stopPropagation();
    const title = inputRef.current.value;
    console.log("title: ,", title);
  };
  return (
    <PathCardContainer onClick={() => nav("/write/" + pathData._id)}>
      <PathCardWrapper>
        {pathData.isEdit ? (
          <>
            <PathCardInputWrapper>
              <PathCardInput
                ref={inputRef}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </PathCardInputWrapper>
            <EditSubmitWrapper onClick={handleEditSubmit}>
              <EditSubmitImg
                src={`${process.env.PUBLIC_URL}/images/editSubmit.svg`}
              />
            </EditSubmitWrapper>
          </>
        ) : (
          <PathCardTitle>{pathData.title}</PathCardTitle>
        )}
      </PathCardWrapper>

      {isHover && (
        <PathCardOptionWrapper
          onClick={(e) => {
            e.stopPropagation();

            if (pathCardStore.contextMenuData?.pathId === pathData._id) {
              pathCardStore.setContextMenuData(null);
              setIsContextMenu((prev) => !prev);
            } else {
              pathCardStore.setContextMenuData({
                pathId: pathData._id,
                x: e.clientX,
                y: e.clientY,
              });
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

const PathCardWrapper = styled.div`
  display: flex;
  padding: 1rem;
  height: 5rem;
`;
const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  white-space: break-spaces;
`;

const PathCardInputWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const InputAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width:100%;
  }
`;

const PathCardInput = styled.input`
  width: 100%;
  animation: ${InputAnimation} 0.3s ease-out;
  font-size: 2.5rem;
  border-bottom: 0.2rem solid rgba(0, 0, 0, 0.1);
  outline: none;
`;

const EditSubmitWrapper = styled.div`
  display: flex;
  width: 2.5rem;
  height: 100%;
  margin: 0 1rem;
`;

const EditSubmitImg = styled.img`
  width: 100%;
  height: 100%;
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
