import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import usePathCardStore from "../../../stores/usePathCardStore";

import { keyframes } from "@emotion/react";

const PathCard = ({ pathData, isHover }) => {
  const nav = useNavigate();
  const pathCardStore = usePathCardStore();
  return (
    <PathCardContainer onClick={() => nav("/write/" + pathData._id)}>
      <PathCardWrapper>
        {pathData.isEdit ? (
          <PathCardInputWrapper>
            <PathCardInput
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            <EditSubmitWrapper>
              <EditSubmitImg
                src={`${process.env.PUBLIC_URL}/images/editSubmit.svg`}
              />
            </EditSubmitWrapper>
          </PathCardInputWrapper>
        ) : (
          <PathCardTitle>{pathData.title}</PathCardTitle>
        )}
      </PathCardWrapper>

      {isHover && (
        <PathCardOptionWrapper
          onClick={(e) => {
            e.stopPropagation();

            pathCardStore.setContextMenuData({
              pathId: pathData._id,
              x: e.clientX,
              y: e.clientY,
            });

            if (pathCardStore.contextMenuData?.pathId === pathData._id) {
              pathCardStore.setContextMenuData(null);
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
  padding: 1rem;
  height: 5rem;
`;
const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  white-space: break-spaces;
`;

const PathCardInputWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const InputAnimation = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

const PathCardInput = styled.input`
  width: 100%;
  flex: 1;
  font-size: 2.5rem;
  border-bottom: 0.2rem solid rgba(0, 0, 0, 0.1);
  outline: none;
  animation: ${InputAnimation} 0.3s ease-out;
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
