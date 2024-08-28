import styled from "styled-components";
import { SessionCurrent } from "./SessionCurrent";
import { Link, Outlet, useLocation } from "react-router-dom";

const MypageLeft = styled.div`
    margin: 30px 50px;
`
const MypageRight = styled.div`
    border: 1px solid white;
    width: 100%;
    height: 800px;
    margin-right: 50px;
`
const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 30px;
  font-weight: ${props => props.$bold? "bold": "lighter"};
`
const StyledLinkDetail = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 20px;
  margin-left: 20px;
  font-weight: ${props => props.$bold? "bold": "lighter"};
`
const Flex = styled.div`
    display: flex;
`
const Text = styled.div`
    font-size: ${props => props.size? props.size: "50px"};
    font-weight: ${props => props.$bold? "bold": "lighter"};
    margin: ${props => props.margin? props.margin: "0"};
    white-space: nowrap;
`

export function MyPage(){
    const { sessionUser } = SessionCurrent();
    const location = useLocation();

    return <>
        <Flex>
            <MypageLeft>
                <Flex style={{alignItems:"center"}}>
                    <Text $bold="true" size="100px">{sessionUser? sessionUser:""}</Text>
                    <Text>님의</Text>
                </Flex>
                <Text style={{marginBottom:"40px"}}>마이페이지</Text>
                <StyledLink to='/mypage/edit' $bold={location.pathname=="/mypage/edit"?true:false}>회원 정보 수정</StyledLink><br/>
                <Text size="30px">피드 정보</Text>
                <StyledLinkDetail to='/mypage/profile' $bold={location.pathname=="/mypage/profile"?true:false}>- 프로필 수정</StyledLinkDetail><br/>
                <StyledLinkDetail to='/mypage/scrap' $bold={location.pathname=="/mypage/scrap"?true:false}>- 스크랩한 피드</StyledLinkDetail><br/>
                <StyledLinkDetail to='/mypage/like' $bold={location.pathname=="/mypage/like"?true:false}>- 좋아요한 피드</StyledLinkDetail><br/>
                <StyledLinkDetail to='/mypage/create' $bold={location.pathname=="/mypage/create"?true:false}>- 피드 작성</StyledLinkDetail><br/>
                <StyledLinkDetail to={'/feed/user/'+sessionUser}>- 개인 피드</StyledLinkDetail><br/>
            </MypageLeft>
            <MypageRight>
                <Outlet/>
            </MypageRight>
        </Flex>
    </>
}