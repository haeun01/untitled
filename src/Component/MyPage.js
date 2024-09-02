import React, { useState } from "react";
import styled from "styled-components";
import { SessionCurrent } from "./SessionCurrent";
import { Link, Outlet, useLocation } from "react-router-dom";

const MypageLeft = styled.div`
  margin: 30px 70px;
`;

const MypageRight = styled.div`
  position: relative;
  width: 72%;
  height: 800px;
  margin-right: 50px;
  background-color: black;
  overflow: hidden;
  border: 2px solid transparent;
  animation: reflectiveBorder 4s infinite;

  @keyframes reflectiveBorder {
    0% {
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.3);
    }
    50% {
      border-color: rgba(255, 255, 255, 1);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.6);
    }
    100% {
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.3);
    }
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 30px;
  font-weight: ${(props) => (props.$bold ? "bold" : "lighter")};
`;

const StyledLinkDetail = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 20px;
  margin-left: 20px;
  font-weight: ${(props) => (props.$bold ? "bold" : "lighter")};
`;

const Flex = styled.div`
  display: flex;
`;

const Text = styled.div`
  font-size: ${(props) => (props.size ? props.size : "50px")};
  font-weight: ${(props) => (props.$bold ? "bold" : "lighter")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
  white-space: nowrap;
`;

export function MyPage() {
  const { sessionUser } = SessionCurrent();
  const location = useLocation();

  // 상태 추가: 피드 정보 클릭 시 토글
  const [showFeedDetails, setShowFeedDetails] = useState(false);

  // 피드 정보 클릭 시 토글하는 함수
  const toggleFeedDetails = () => {
    setShowFeedDetails((prev) => !prev);
  };

  return (
    <>
      <Flex>
        <MypageLeft>
          <Flex style={{ alignItems: "center" }}>
            <Text $bold="true" size="100px">
              {sessionUser ? sessionUser : ""}
            </Text>
            <Text>님의</Text>
          </Flex>
          <Text style={{ marginBottom: "40px" }}>마이페이지</Text>
          <StyledLink to="/mypage/edit" $bold={location.pathname === "/mypage/edit"}>
            회원 정보 수정
          </StyledLink>
          <br />
          <Text size="30px" onClick={toggleFeedDetails} style={{ cursor: "pointer" }}>
            피드 정보
          </Text>
          {showFeedDetails && (
            <>
              <StyledLinkDetail to="/mypage/scrap" $bold={location.pathname === "/mypage/scrap"}>
                - 스크랩한 피드
              </StyledLinkDetail>
              <br />
              <StyledLinkDetail to="/mypage/like" $bold={location.pathname === "/mypage/like"}>
                - 좋아요한 피드
              </StyledLinkDetail>
              <br />
              <StyledLinkDetail to="/mypage/create" $bold={location.pathname === "/mypage/create"}>
                - 피드 작성
              </StyledLinkDetail>
              <br />
              <StyledLinkDetail to="/mypage/profile" $bold={location.pathname === "/mypage/profile"}>
                - 프로필 수정
              </StyledLinkDetail>
              <br />
              <StyledLinkDetail to={`/feed/user/${sessionUser}`}>
                - 개인 피드
              </StyledLinkDetail>
              <br />
            </>
          )}
        </MypageLeft>
        <MypageRight>
          <Outlet />
        </MypageRight>
      </Flex>
    </>
  );
}
