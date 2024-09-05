import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SessionCurrent } from "./SessionCurrent";
import up from "./../img/up_feedTab.png";
import home from "./../img/home_feedTab.png";
import write from "./../img/write_feedTab.png";
import account from "./../img/account_feedTab.png";
import bookmark from "./../img/bookmark_feedTab.png";
import favorite from "./../img/favorite_feedTab.png";
import { useEffect } from "react";

const TabContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: end;
    margin-right: 20px;
    position: fixed; /* fixed로 변경하여 화면에 고정 */
    right: 20px; /* 오른쪽에서 20px 떨어진 위치 */
    bottom: 20px; /* 아래쪽에서 20px 떨어진 위치 */
`

const Tab = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(to right, rgba(86, 22, 137, 0.5), rgba(0, 128, 128, 0.5));
    color: white;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }
`

const Img = styled.img`
    width: 50px;
    height: 50px;
`

export function FeedTab(){
    const navigate = useNavigate();
    const { sessionUser } = SessionCurrent();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return <>
        {sessionUser? sessionUser!="anonymousUser"? <TabContainer>
            <Tab onClick={()=>{navigate("/feed/home")}}>
                <Img src={home}/>
                <div>피드홈</div>
            </Tab>
            <Tab onClick={()=>{navigate("/feed/user/"+sessionUser)}}>
                <Img src={account}/>
                <div>개인피드</div>
            </Tab>
            <Tab onClick={()=>{navigate("/mypage/create")}}>
                <Img src={write}/>
                <div>피드작성</div>
            </Tab>
            <Tab onClick={()=>{navigate("/mypage/like")}}>
                <Img src={favorite}/>
                <div>좋아요</div>
            </Tab>
            <Tab onClick={()=>{navigate("/mypage/scrap")}}>
                <Img src={bookmark}/>
                <div>스크랩</div>
            </Tab>
            <Tab onClick={scrollToTop}>
                <Img src={up}/>
                <div>위로가기</div>
            </Tab>
        </TabContainer>: <LogoutFeedTab/>: <LogoutFeedTab/>}
    </>
}

function LogoutFeedTab(){
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return <>
        <TabContainer>
            <Tab onClick={()=>{navigate("/feed/home")}}>
                <Img src={home}/>
                <div>피드홈</div>
            </Tab>
            <Tab onClick={scrollToTop}>
                <Img src={up}/>
                <div>위로가기</div>
            </Tab>
        </TabContainer>
    </>
}