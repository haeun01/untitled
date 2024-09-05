import styled from "styled-components";
import { SessionCurrent } from "./SessionCurrent";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getServerImgFile } from "./File";
import defaltUserImg from "./../img/defaltUserImg.png";
import logo from "./../images/logo/logo_white.png";

const Logo = styled.div`
  width: 200px;
  height: 200px;
  margin: auto;
  animation: rotate_image 10s linear infinite;
  transform-origin: 50% 50%;
  @keyframes rotate_image {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export function Loading(){
    return <>
        <Logo>
            <img
              src={logo}
              width="200"
              height="200"
              alt="untitled_logo"
            />
        </Logo>
        <div style={{textAlign:"center", fontWeight:"bold", fontSize:"30px", margin:"20px"}}>로딩중입니다.</div>
    </>
}

export const Title = styled.div`
    font-size: 50px;
    padding-top: 100px;
    padding-bottom: 80px;
    text-align: center;
`


const ScrollableContainer = styled.div`
    width: ${props => props.width};         /* 컨테이너의 너비 */
    height: ${props => props.height};      /* 고정된 높이 설정 */
    overflow-y: auto;   /* 수직 스크롤 활성화 */
    /* border: 1px solid #ccc; 경계선 추가 (선택 사항) */
    padding: ${props => props.padding? props.padding: "10px"};      /* 내부 여백 추가 (선택 사항) */
    margin: auto;
    /* scrollbar-width: thin; */
    /* scrollbar-width: none; */
    /* 스크롤바 모양 직접 설정 */
    &::-webkit-scrollbar {
        width: 10px; 
        height: 10px;  
    }

    &::-webkit-scrollbar-thumb {
        background-color: #888;             /* 스크롤바의 색상 */
        border-radius: 10px;                /* 스크롤바 모서리를 둥글게 */
        border: 2px solid #555;             /* 스크롤바 테두리 색상 및 두께 */
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #555;             /* 마우스 오버 시 스크롤바 색상 */
    }

    &::-webkit-scrollbar-track {
        background-color: #f1f1f1;          /* 스크롤바 트랙(배경) 색상 */
        border-radius: 10px;                /* 트랙 모서리 둥글게 */
        border: 1px solid #d4d4d4;          /* 트랙 테두리 색상 및 두께 */
    }
    
    &::-webkit-scrollbar-corner {
        background-color: #f1f1f1;          /* 스크롤바 모퉁이 색상 */
    }
`

export function ScrollableContent({ width, height, padding, children }) {
    return (
        <ScrollableContainer height={height} width={width} padding={padding}>
            { children }
        </ScrollableContainer>
    );
}

const SubBtn = styled.div`
    font-size: 15px;
    padding: 8px 0px;
    width: 80px;
    background-color: ${props => props.$subcheck? "#041346": "white"};
    color: ${props => props.$subcheck? "white": "#041346"};
    border: 5px solid #041346;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    user-select: none;
`

export function SubButton({ teacher, onToggle }){
    const { sessionUser } = SessionCurrent();
    const [subCheck, setSubCheck] = useState(false);
    const [subId, setSubId] = useState();

    useEffect(() => {
        if (sessionUser) {
            GetSubCheck()
        }
    }, [sessionUser, subCheck]);

    async function GetSubCheck(){
        try{
            const response = await axios.post("http://localhost:8080/api/subscriptionCheck", {user: {userId: sessionUser}, teacher: {id: teacher.id}});
            const data = response.data;
            if(data){
                setSubCheck(true)
                setSubId(data.id)
            }else{
                setSubCheck(false)
            }
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function SubBtnClick(){
        try{
            if(subCheck){
                const response = await axios.post("http://localhost:8080/api/subscriptionCansel", {id: subId});
                const data = response.data;
                setSubCheck(false)
                console.log(data)
            } else{
                const response = await axios.post("http://localhost:8080/api/subscription", {user: {userId: sessionUser}, teacher: {id: teacher.id}});
                const data = response.data;
                setSubCheck(true)
                console.log(data)
            }
            if (onToggle) onToggle();
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }
    
    return <>
        <SubBtn $subcheck={subCheck} onClick={(event) => {event.stopPropagation();SubBtnClick();}}>{subCheck? "구독중": "구독"}</SubBtn>
    </>
}


// tooltip 부분
const TooltipContainer = styled.div`
  visibility: hidden;
  background-color: #222;
  color: #fff;
  text-align: start;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: ${props => props.$bottom? "100%": "none"};
  /* bottom: 125%; Position the tooltip above the text */
  left: 50%;
  margin-left: -60px; /* Center the tooltip */
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 15px;
`;

const TooltipContainerHover = styled.div`
  position: relative;
  display: inline-block;
  &:hover ${TooltipContainer} {
    visibility: visible;
    opacity: 1;
  }
`;

export function Tooltip({ children, tooltipContents, bottom }) {
    // console.log("tooltipContents", tooltipContents)
    return <>
        {tooltipContents.props.children && tooltipContents.props.children.length!=0? <TooltipContainerHover>
            {children}
            <TooltipContainer $bottom={bottom}>
                {tooltipContents}
            </TooltipContainer>
        </TooltipContainerHover>: <div>{children}</div>}
    </>;
}

export function FollowerTooltip(followerList, func){
    return <ScrollableContent width="300px" height="300px">
        {followerList.map((follower, index)=>(<UserBarContent key={index} user={follower.user} func={func}/>))}
    </ScrollableContent>
}

export function FollowingTooltip(followingList, func){
    return <ScrollableContent width="300px" height="300px">
        {followingList.map((following, index)=>(<UserBarContent key={index} user={following.user2} func={func}/>))}
    </ScrollableContent>
}

export function LikeTooltip(LikeUserList, func){
    // console.log(LikeUserList)
    return <ScrollableContent width="300px" height="300px">
        {LikeUserList && LikeUserList.map((likeUser, index)=>(<UserBarContent key={index} user={likeUser.user} func={func}/>))}
    </ScrollableContent>
}

const MyFeedBtn = styled.div`
    cursor: pointer;
    margin: 5px 0;
    &:hover {
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.4);
        transform: scale(1.03);
    }
`

export function MyFeedTooltip(feed, deleteFunc, editFunc){
    async function deleteBtn(){
        try{
            const responseLike = await axios.post("http://localhost:8080/api/deleteFeedLikeByFeed", {id:feed.id});
            const responseScrap = await axios.post("http://localhost:8080/api/deleteFeedScrapByFeed", {id:feed.id});
            const responseCommentLike = await axios.post("http://localhost:8080/api/deleteFeedCommentLikeByFeed", {id:feed.id});
            const responseComment = await axios.post("http://localhost:8080/api/deleteFeedCommentByFeed", {id:feed.id});
            const responseFeed = await axios.post("http://localhost:8080/api/deleteFeed", {id:feed.id});
            deleteFunc()
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    } 

    function editBtn(){
        editFunc()
    }

    return <>
        <MyFeedBtn onClick={()=>{deleteBtn()}}>삭제하기</MyFeedBtn>
        <MyFeedBtn onClick={()=>{editBtn()}}>수정하기</MyFeedBtn>
    </>
}

const ProfileImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
`

const TooltipFlex = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    margin: 10px 0;
    width: 100%;
`

const FollowerBtn = styled.div`
    background-color: #25559B;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
`

const FollowingBtn = styled.div`
    background-color: white;
    color: black;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
`

function UserBarContent({user, func}){
    const [follower, setFollower] = useState();
    const [followerNum, setFollowerNum] = useState();
    const [followingNum, setFollowingNum] = useState();
    const { sessionUser } = SessionCurrent();
    const navigate = useNavigate();
    const [sessionUserFollow, setSessionUserFollow] = useState();
    const [followChange, setFollowChange] = useState(false);

    useEffect(() => {
        GetFollowing()
        GetFollower()
        GetFollowerNum()
    }, [user]);

    useEffect(() => {
        if(sessionUser && follower){
            IsUserFollow()
        }
    }, [sessionUser, follower, user]);

    useEffect(() => {
        GetFollower()
        GetFollowerNum()
    }, [followChange]);

    async function GetFollower(){
        try{
            const response = await axios.post("http://localhost:8080/api/userFollow/user2", {userId: user.userId});
            const data = response.data;
            // console.log("GetFollower", data);
            setFollower(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFollowerNum(){
        try{
            const response = await axios.post("http://localhost:8080/api/numberOfFollowByUser2", {userId: user.userId});
            const data = response.data;
            // console.log("GetFollower", data);
            setFollowerNum(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFollowing(){
        try{
            const response = await axios.post("http://localhost:8080/api/numberOfFollowByUser", {userId: user.userId});
            const data = response.data;
            // console.log("GetFollowing", data);
            setFollowingNum(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    function IsUserFollow(){
        setSessionUserFollow()
        follower.map((userFollow)=>
            {
                if(userFollow.user.userId==sessionUser){
                setSessionUserFollow(userFollow.id)
                return
            }}
        )
    }

    async function FollowClick(){
        if(sessionUser=="anonymousUser"){
            const result = window.confirm("로그인이 필요한 서비스입니다. 로그인 창으로 이동할까요?");
            if (result) {
                window.location.href = '/login';
            }
            return;
        }

        try{
            if(sessionUserFollow){
                const response = await axios.delete("http://localhost:8080/api/userFollow", {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        id:sessionUserFollow
                    }
                });
                const data = response.data;
                console.log("FollowClick", data)
                setFollowChange(!followChange);
                func()
            }else{
                const response = await axios.post("http://localhost:8080/api/userFollow", {user:{userId: sessionUser}, user2:{userId: user.userId}});
                const data = response.data;
                console.log("FollowClick", data)
                setFollowChange(!followChange);
                func()
            }
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }
    
    return <>
        <TooltipFlex>
            <div style={{width:"30px", height:"30px"}}>
                <ProfileImage src={user.data? getServerImgFile(user.data): defaltUserImg} onClick={()=>{navigate("/feed/user/"+user.userId)}}/>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", width: "100%"}}>
                <div>
                    <div>{user.userId}</div>
                    <div>팔로워 {followerNum} 팔로잉 {followingNum}</div>
                </div>
                {sessionUser!=user.userId? sessionUserFollow? <FollowingBtn onClick={()=>{FollowClick()}}>팔로잉</FollowingBtn>: 
                    <FollowerBtn onClick={()=>{FollowClick()}}>팔로우</FollowerBtn>: null
                }
            </div>
        </TooltipFlex>
    </>
}



