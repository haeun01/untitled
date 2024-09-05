import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SessionCurrent } from "./SessionCurrent";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Loading } from "./Styles";

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

  /* 네 변에 애니메이션 효과 추가 */
  &::before,
  &::after,
  & span:nth-of-type(1),
  & span:nth-of-type(2) {
    content: '';
    position: absolute;
    background: #fff;
    pointer-events: none;
  }

  /* 위쪽 라인 */
  &::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #fff);
    animation: animate1 2.5s linear infinite;
  }

  /* 오른쪽 라인 */
  &::after {
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #fff);
    animation: animate2 2.5s linear infinite;
    animation-delay: 0.5s;
  }

  /* 아래쪽 라인 */
  & span:nth-of-type(1) {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #fff);
    animation: animate3 2.5s linear infinite;
    animation-delay: 1s;
  }

  /* 왼쪽 라인 */
  & span:nth-of-type(2) {
    bottom: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #fff);
    animation: animate4 2.5s linear infinite;
    animation-delay: 1.5s;
  }

  @keyframes animate1 {
    0% {
      left: -100%;
    }
    50%, 100% {
      left: 100%;
    }
  }

  @keyframes animate2 {
    0% {
      top: -100%;
    }
    50%, 100% {
      top: 100%;
    }
  }

  @keyframes animate3 {
    0% {
      right: -100%;
    }
    50%, 100% {
      right: 100%;
    }
  }

  @keyframes animate4 {
    0% {
      bottom: -100%;
    }
    50%, 100% {
      bottom: 100%;
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

  useEffect(() => {
    if(sessionUser=="anonymousUser"){
      alert("로그인이 필요한 서비스입니다.");
      window.location.href = '/login';
    }
  }, [sessionUser]);

  return (
    <>
      {sessionUser? sessionUser!="anonymousUser"? <Flex>
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
        <span></span>
        <span></span>
          <Outlet />
        </MypageRight>
      </Flex>:<Loading/>:<Loading/>}
    </>
  );
}
