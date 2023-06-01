import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { throttle } from "lodash";
import usePathCardStore from "../../../stores/usePathCardStore";

const userId = "wkdrmadl3";

const getMaxCardCount = () => {
  const PathListWidth = window.innerWidth - 80;
  let columnCount = Math.floor(PathListWidth / 240);

  if (PathListWidth < columnCount * 240) {
    columnCount--;
  }
  return columnCount > 1 ? columnCount : 1;
};

const PathList = () => {
  const nav = useNavigate();
  const pathCardStore = usePathCardStore();
  const [cardColumn, setCardColumn] = useState(getMaxCardCount);
  console.log("cardColumn: ", cardColumn);

  const goToPathWrite = (pathId) => {
    nav("/write/" + pathId);
  };

  const createPath = async () => {
    const pathId = await pathCardStore.createPath(userId);
    goToPathWrite(pathId);
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      setCardColumn(getMaxCardCount);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PathContainer>
      <AddButtonWrapper>
        <AddButton onClick={createPath}>
          <AddButtonSpan>+</AddButtonSpan>
        </AddButton>
      </AddButtonWrapper>
      <PathCardContainer>
        {pathCardStore.pathList.map((path) => (
          <PathCard
            columnCount={cardColumn}
            key={path._id}
            onClick={() => {
              goToPathWrite(path._id);
            }}
          >
            <PathCardTitle>{path.title}</PathCardTitle>
          </PathCard>
        ))}
        {/* {Array(Math.ceil(pathCardStore.pathList?.length / cardColumn))
          .fill(0)
          .map((_, index) => (
            <FlexWrapper key={index}>
              {pathCardStore.pathList
                .slice(index * cardColumn, index * cardColumn + cardColumn)
                .map((path) => (
                  <PathCard
                    columnCount={cardColumn}
                    key={path._id}
                    onClick={() => {
                      goToPathWrite(path._id);
                    }}
                  >
                    <PathCardTitle>{path.title}</PathCardTitle>
                  </PathCard>
                ))}
            </FlexWrapper>
          ))} */}
      </PathCardContainer>
    </PathContainer>
  );
};

export default PathList;

const PathContainer = styled.div`
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

const FlexWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const PathCard = styled.div`
  //width: ${(props) => `calc(100% / ${props.columnCount} - 1rem)`};
  max-width: ${(props) => `100 / ${props.cardColumn}%`};
  flex-basis: 25%;
  min-height: 15rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  //margin: 0 0.5rem;
  cursor: pointer;
  background: white;
`;

const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  margin: 1rem;
  word-break: break-all;
`;

const AddButtonWrapper = styled.div`
  padding: 0.5rem 0;
`;

const AddButton = styled.div`
  width: 5rem;
  height: 5rem;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  margin-left: auto;
`;

const AddButtonSpan = styled.span`
  font-size: 4rem;
  line-height: 4rem;
`;
