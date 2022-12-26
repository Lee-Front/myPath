import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import CardEditor from "./CardEditor";

const PathWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`;
const PathListWrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 1rem;
`;

const PathFlexWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const PathCard = styled.div`
  width: ${(props) => `calc(100% / ${props.columnCount})`};
  max-width: 30rem;
  min-height: 15rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:not(:first-child) {
    margin-left: 1rem;
  }
`;

const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  margin: 1rem;
  word-break: break-all;
`;

const AddButtonWarpper = styled.div`
  height: 5rem;
  margin: 1rem 0;
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

const AddButtonRotateWrapper = styled.div`
  transform: ${(props) => (props.isPop ? "rotate(45deg)" : "")};
  width: 100%;
  height: 100%;
  transition: 0.2s;
  & span {
    font-size: 4rem;
    line-height: 4rem;
  }
`;

const AddPathWrapper = styled.div`
  width: 100%;
  height: ${(props) => (props.isPop ? "calc(100% - 8rem)" : "0rem")};
  position: absolute;
  margin-top: 1rem;
  transition: 0.5s;
  overflow: hidden;
`;

const cardList = [
  { id: 1, title: "테크마인드" },
  { id: 2, title: "유밥" },
  { id: 3, title: "Career1" },
  { id: 4, title: "Career2" },
  { id: 5, title: "Career3" },
  { id: 6, title: "Career4" },
  { id: 7, title: "Career5" },
  { id: 8, title: "Career6" },
];

const PathList = () => {
  let columnCount = Math.floor((window.innerWidth - 80) / 300);
  const [column, setColumn] = useState(columnCount ? columnCount : 1);
  const nav = useNavigate();
  const [isPop, setIsPop] = useState(false);

  const changePathColumn = () => {
    const CardListWidth = window.innerWidth - 80;
    // 900  300으로 나누면 3개 근데 gab을 생각하면 2개가 들어가야됨
    columnCount = Math.floor(CardListWidth / 300);

    if (CardListWidth < columnCount * 300 + (columnCount - 1) * 10) {
      columnCount--;
    }
    setColumn(columnCount ? columnCount : 1);
  };

  const movePathDetail = (pathId) => {
    nav("/pathDetail?pathId=" + pathId);
  };

  useEffect(() => {
    window.addEventListener("resize", changePathColumn);
  }, []);

  return (
    <PathWrapper>
      <AddButtonWarpper>
        <div>
          <AddButton
            onClick={() => {
              setIsPop(!isPop);
            }}
          >
            <AddButtonRotateWrapper isPop={isPop}>
              <span>+</span>
            </AddButtonRotateWrapper>
          </AddButton>
        </div>
        <AddPathWrapper isPop={isPop}>
          <CardEditor />
        </AddPathWrapper>
      </AddButtonWarpper>

      <PathListWrapper>
        {Array(Math.ceil(cardList.length / column))
          .fill(0)
          .map((_, index) => (
            <PathFlexWrapper key={index}>
              {cardList
                .slice(index * column, index * column + column)
                .map((card) => (
                  <PathCard
                    columnCount={column}
                    key={card.id}
                    onClick={() => {
                      movePathDetail(card.id);
                    }}
                  >
                    <PathCardTitle>{card.title}</PathCardTitle>
                  </PathCard>
                ))}
            </PathFlexWrapper>
          ))}
      </PathListWrapper>
    </PathWrapper>
  );
};

export default PathList;
