import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import usePathCardStore from "../../../stores/usePathCardStore";

const SideBar = ({ isSideBarOpen, pathList }) => {
  const pathCardStore = usePathCardStore();
  const [searchText, setSearchText] = useState("");
  const imagePath = process.env.PUBLIC_URL + "/images";

  useEffect(() => {
    pathCardStore.getPathList("wkdrmadl3");
  }, []);
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
            autoComplete="off"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </SearchWrapper>
        <SideBarButtonWrapper>
          <SideBarButtonImage src={`${imagePath}/smallAddButton.svg`} />
          새로운 명함 생성하기
        </SideBarButtonWrapper>
        <SideBarButtonContainer>
          {pathCardStore.pathList.map((path) => (
            <SideBarButtonWrapper key={path._id}>
              <SideBarButtonImage src={`${imagePath}/leftArrow.svg`} />
              {path.title}
            </SideBarButtonWrapper>
          ))}
        </SideBarButtonContainer>
      </ContentWrapper>
      <SettingButtonWrapper>
        <SettingButtonImage src={`${imagePath}/setting.svg`} />
        설정
      </SettingButtonWrapper>
    </SideBarContainer>
  );
};

export default SideBar;

const SideBarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.isSideBarOpen ? "30rem" : "0rem")};
  transition: width 0.3s;
  overflow: hidden;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const Logo = styled.img`
  margin-top: 2rem;
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

const SideBarButtonContainer = styled.div`
  flex: 1;
  overflow: scroll;
`;
const SideBarButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  :hover {
    background-color: #e2e2e2;
  }
`;
const SideBarButtonImage = styled.img`
  width: 2.2rem;
  height: 2.2rem;
  filter: blur(0.06rem);
`;

const SettingButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  color: #c4c4c4;
  border-radius: 0.5rem;
  margin: 1.7rem 2rem;
  white-space: nowrap;
  :hover {
    background-color: #e2e2e2;
  }
`;
const SettingButtonImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`;
