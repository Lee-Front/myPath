import React from "react";
import styled from "@emotion/styled";

const SideBar = ({ isSideBarOpen }) => {
  const imagePath = process.env.PUBLIC_URL + "/images";
  return (
    <SideBarContainer isSideBarOpen={isSideBarOpen}>
      <ContentWrapper>
        <Image src={`${imagePath}/logo.svg`} width={"7rem"} alt="Logo" />
        <SearchWrapper>
          <Image src={process.env.PUBLIC_URL + ""} />
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

const Image = styled.img`
  width: ${(props) => props.width || "3rem"};
`;

const SearchWrapper = styled.div``;
