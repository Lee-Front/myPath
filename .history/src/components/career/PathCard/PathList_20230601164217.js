import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { throttle } from "lodash";
import usePathCardStore from "../../../stores/usePathCardStore";

const userId = "wkdrmadl3";

const PathList = () => {
  const nav = useNavigate();
  const pathCardStore = usePathCardStore();
  const containerRef = useRef(null);

  const [cardColumn, setCardColumn] = useState(0);

  const goToPathWrite = (pathId) => {
    nav("/write/" + pathId);
  };

  const createPath = async () => {
    const pathId = await pathCardStore.createPath(userId);
    if (pathId) {
      goToPathWrite(pathId);
    }
  };

  useEffect(() => {
    const getMaxCardCount = () => {
      const { width } = containerRef.current.getBoundingClientRect();
      let columnCount = Math.ceil(width / 300);
      return columnCount > 1 ? columnCount : 1;
    };

    setCardColumn(getMaxCardCount);

    const resizeObserver = new ResizeObserver(
      throttle(() => {
        setCardColumn(getMaxCardCount);
      }, 100)
    );
    resizeObserver.observe(containerRef.current);
  }, []);

  return (
    <PathContainer>
      <PathCardContainer ref={containerRef}>
        <PathCardWrapper cardColumn={cardColumn}>
          <PathCard onClick={createPath}>
            <AddButtonImage
              src={`${process.env.PUBLIC_URL}/images/bigAddButton.svg`}
            />
          </PathCard>
        </PathCardWrapper>
        {pathCardStore.pathList.map((path) => (
          <PathCardWrapper key={path._id} cardColumn={cardColumn}>
            <PathCard
              onClick={() => {
                goToPathWrite(path._id);
              }}
            >
              <PathCardTitle>{path.title}</PathCardTitle>
            </PathCard>
          </PathCardWrapper>
        ))}
      </PathCardContainer>
    </PathContainer>
  );
};

export default PathList;

const PathContainer = styled.div`
  padding-top: 8rem;
  padding-left: 4rem;
  padding-right: 4rem;
  display: flex;

  flex-direction: column;
  height: 100%;
`;
const PathCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
`;

const PathCardWrapper = styled.div`
  padding: 1rem;
  flex-basis: ${(props) => `${100 / props.cardColumn}%`};
`;

const PathCard = styled.div`
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
  word-break: break-all;
`;

const AddButtonImageWrapper = styled.div`
  padding: 0.5rem 0;
`;
const AddButtonImage = styled.img``;
