import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { throttle } from "lodash";

const PathContainer = styled.div`
  padding-left: 4rem;
  padding-right: 4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const PathCardContainer = styled.div`
  overflow-y: scroll;
`;

const FlexWrapper = styled.div`
  //display: flex;
  margin-bottom: 1rem;
`;

const PathCard = styled.div`
  width: ${(props) => `calc(100% / ${props.columnCount} - 1rem)`};
  min-height: 15rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0 0.5rem;
  cursor: pointer;
  background: white;
`;

const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  margin: 1rem;
  word-break: break-all;
  padding-bottom: 40%;
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

const AddButtonRotateWrapper = styled.div`
  width: 100%;
  height: 100%;
  transition: 0.2s;
  & span {
    font-size: 4rem;
    line-height: 4rem;
  }
`;

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
  const [pathList, setPathList] = useState([]);
  const [cardColumn, setCardColumn] = useState(getMaxCardCount);

  const getPathList = async (userId) => {
    const pathList = await axios.get("/api/path/getList", {
      params: { userId },
    });
    setPathList(pathList.data);
  };

  const createPath = async (userId) => {
    const pathName = prompt("path의 이름을 입력하세요", "Path명");

    const createPath = await axios.post("/api/path/create", {
      userId,
      title: pathName,
      sort: 0,
    });
    if (createPath.status === 200) {
      nav("/write", { state: { pathId: createPath.data.pathId } });
    }
  };

  useEffect(() => {
    getPathList(userId);
  }, []);

  useEffect(() => {
    const handleResize = throttle(() => {
      setCardColumn(getMaxCardCount);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const moveWritePage = (pathId) => {
    nav("/write", { state: { pathId } });
  };

  return (
    <PathContainer>
      <AddButtonWrapper>
        <AddButton
          onClick={() => {
            createPath(userId);
          }}
        >
          <AddButtonRotateWrapper>
            <span>+</span>
          </AddButtonRotateWrapper>
        </AddButton>
      </AddButtonWrapper>
      <PathCardContainer>
        {Array(Math.ceil(pathList?.length / cardColumn))
          .fill(0)
          .map((_, index) => (
            <FlexWrapper key={index}>
              {pathList
                .slice(index * cardColumn, index * cardColumn + cardColumn)
                .map((path) => (
                  <PathCard
                    columnCount={cardColumn}
                    key={path.pathId}
                    onClick={() => {
                      moveWritePage(path.pathId);
                    }}
                  >
                    <PathCardTitle>{path.title}</PathCardTitle>
                  </PathCard>
                ))}
            </FlexWrapper>
          ))}
      </PathCardContainer>
    </PathContainer>
  );
};

export default PathList;
