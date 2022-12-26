import React from "react";
import styled from "@emotion/styled";

const PathWrapper = styled.div`
  /* width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(15rem, 1fr));
  grid-gap: 1rem;
   */
  overflow-y: scroll;
  padding-top: 5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PathFlexWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PathCard = styled.div`
  width: 30rem;
  min-height: 15rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  margin: 1rem;
  word-break: break-all;
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

const PathList = ({ cardType, column }) => {
  let listColumn = column ? column : 1;

  return (
    <div style={{ display: "flex" }}>
      <div>123</div>
      <PathWrapper>
        {Array(Math.ceil(cardList.length / listColumn))
          .fill(0)
          .map((_, index) => (
            <PathFlexWrapper key={index}>
              {cardList
                .slice(index * listColumn, index * listColumn + listColumn)
                .map((card) => (
                  <PathCard key={card.id}>
                    <PathCardTitle>{card.title}</PathCardTitle>
                  </PathCard>
                ))}
            </PathFlexWrapper>
          ))}
      </PathWrapper>
    </div>
  );
};

export default PathList;
