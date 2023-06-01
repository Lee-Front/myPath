import React, { useState } from "react";
import styled from "@emotion/styled";

const SideBar = ({ isSideBarOpen }) => {
  const [searchText, setSearchText] = useState("");
  const imagePath = process.env.PUBLIC_URL + "/images";
  const handleSearch = (e) => {
    if (e.type === "keydown") {
      console.log("e.target.value : ", e);
      setSearchText(e.target.value);
    }
  };
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
            onChange={handleSearch}
            onKeyDown={handleSearch}
          />
        </SearchWrapper>
        <div>
          <div>카드1</div>
          <div>카드2</div>
        </div>
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
  ::placeholder {
    color: #c4c4c4;
  }
`;
