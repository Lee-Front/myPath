import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  display: flex;
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

const PathList = () => {
  console.log("?!");
  const userId = "wkdrmadl3";
  let columnCount = 0;
  const [pathList, setPathList] = useState([]);
  const [column, setColumn] = useState(1);
  const nav = useNavigate();

  // getPathList 를 개선해줘
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

  const changePathColumn = () => {
    const PathListWidth = window.innerWidth - 80;
    columnCount = Math.floor(PathListWidth / 240);

    if (PathListWidth < columnCount * 240) {
      columnCount--;
    }
    setColumn(columnCount ? columnCount : 1);
  };

  const movePathDetail = (pathId) => {
    nav("/write", { state: { pathId } });
  };

  useEffect(() => {
    changePathColumn();
    window.addEventListener("resize", changePathColumn);
  }, []);

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
        {pathList
          .reduce((rows, path, index) => {
            console.log("idx : ", index);
            const currentRow = Math.floor(index / column);
            if (!rows[currentRow]) {
              rows[currentRow] = [];
            }
            rows[currentRow].push(
              <PathCard
                columnCount={column}
                key={path.pathId}
                onClick={() => {
                  movePathDetail(path.pathId);
                }}
              >
                <PathCardTitle>{path.title}</PathCardTitle>
              </PathCard>
            );
            return rows;
          }, [])
          .map((row, idx) => (
            <FlexWrapper key={idx}>{row}</FlexWrapper>
          ))}
        {/* {Array(Math.ceil(pathList?.length / column))
          .fill(0)
          .map((_, index) => (
            <FlexWrapper key={index}>
              {pathList
                .slice(index * column, index * column + column)
                .map((path) => (
                  <PathCard
                    columnCount={column}
                    key={path.pathId}
                    onClick={() => {
                      movePathDetail(path.pathId);
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
