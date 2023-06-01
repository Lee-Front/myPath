import React from "react";
import styled from "@emotion/styled";

const SideBar = ({ isSideBarOpen }) => {
  return (
    <SideBarContainer isSideBarOpen={isSideBarOpen}>
      <ContentWrapper>
        <Logo src={process.env.PUBLIC_URL + "/images/logo.svg"} alt="Logo" />
        <div>검색영역</div>
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
`;
const ContentWrapper = styled.div`
  padding: 2rem;
`;

const Logo = styled.img``;
