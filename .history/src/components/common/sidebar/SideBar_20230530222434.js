import React, { useState } from "react";
import styled from "@emotion/styled";

const SideBar = ({ isSideBarOpen }) => {
  const [searchText, setSearchText] = useState("");
  const imagePath = process.env.PUBLIC_URL + "/images";
  const handleSearch = () => {
    console.log("searchText : ", searchText);
  };
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const list = [
    { id: 1, name: "카드1" },
    { id: 2, name: "카드2" },
    { id: 3, name: "카드3" },
  ];
  return (
    <SideBarContainer isSideBarOpen={isSideBarOpen}>
      <ContentWrapper>
        <Logo src={`${imagePath}/logo.svg`} alt="Logo" />
        <SearchWrapper>
          <SearchImage
            src={`${imagePath}/search.svg`}
            onClick={handleSearch}
            alt="search button"
          />
          <SearchInput
            name="search"
            placeholder="검색"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </SearchWrapper>
        {list.map((item) => (
          <SideBarButtonWrapper key={item.id}>
            <SideBarButtonImage src={`${imagePath}/leftArrow.svg`} />
            <SideBarButton>{item.name}</SideBarButton>
          </SideBarButtonWrapper>
        ))}
        <SideBarButtonWrapper>
          <SideBarButtonImage />
          <SideBarButton>새로운 명함 생성하기</SideBarButton>
        </SideBarButtonWrapper>
      </ContentWrapper>
    </SideBarContainer>
  );
};

export default SideBar;

const SideBarContainer = styled.aside`
  width: ${(props) => (props.isSideBarOpen ? "20rem" : "0rem")};
  transition: width 0.3s;
  overflow: hidden;
`;
const ContentWrapper = styled.div`
  padding: 2rem;
`;

const Logo = styled.img`
  width: 7rem;
`;

const SearchWrapper = styled.div`
  display: flex;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  padding: 0.7rem 0;
  border-top: 0.1rem solid #c4c4c4;
  border-bottom: 0.1rem solid #c4c4c4;
`;

const SearchImage = styled.img`
  width: 2.2rem;
`;
const SearchInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  background-color: transparent;
  text-indent: 0.5rem;
  font-size: 1.6rem;
  ::placeholder {
    color: #c4c4c4;
  }
`;

const SideBarButtonWrapper = styled.div`
  display: flex;
`;
const SideBarButtonImage = styled.img`
  shape-rendering: auto;
  filter: blur(0.05rem);
  width: 2.5rem;
  height: 2.5rem;
`;

const SideBarButton = styled.div``;
