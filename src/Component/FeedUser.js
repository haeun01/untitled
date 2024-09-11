import { useNavigate, useParams } from "react-router-dom";
import { PopupContainer } from "./PopupContainer";
import { useEffect, useState } from "react";
import axios from "axios";
import { SessionCurrent } from "./SessionCurrent";
import styled from "styled-components";
import { FollowerTooltip, FollowingTooltip, Loading, ScrollableContent, Tooltip } from "./Styles";
import { getServerImgFile } from "./File";
import defaltUserImg from "./../img/defaltUserImg.png";
import { FeedTab } from "./FeedTab";


const Container = styled.div`
    padding: 10px 15%;
    width: 100%;
`

const ProfileImg = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
`

const Flex = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const FlexC = styled.div`
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 10px;
`

const ProfileText = styled.div`
    border-radius: 5px;
    white-space: pre-line;
`

const FeedContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
`

const Img = styled.img`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    cursor: pointer;
    &:hover {
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.4);
        transform: scale(1.03);
    }
`

const Btn = styled.div`
    width: 200px;
    padding: 10px 0;
    border-radius: 50px;
    background-color: #561689;
    border: 1px solid black;
    text-align: center;
    cursor: pointer;
    &:hover {
        /* box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.4); */
        background-color: #25559B;
        color: white;
    }
`

export function FeedUser(){
    const { id } = useParams();
    const [user, setUser] = useState();
    const [feedList, setFeedList] = useState();
    const [follower, setFollower] = useState();
    const [following, setFollowing] = useState();
    const { sessionUser } = SessionCurrent();
    const navigate = useNavigate();
    const [sessionUserFollow, setSessionUserFollow] = useState();
    const [followChange, setFollowChange] = useState(false);
    const [teacher, setTeacher] = useState(false);
    const [isMyPage, setIsMyPage] = useState(false);

    useEffect(() => {
        GetFeedList()
        GetUser()
        IsTeacher()
    }, [id]);

    useEffect(() => {
        GetFollower()
        GetFollowing()
    }, [id, followChange]);

    useEffect(() => {
        if(sessionUser && follower){
            IsUserFollow()
        }
    }, [sessionUser, follower]);

    useEffect(() => {
        if(sessionUser==id){
            setIsMyPage(true)
        }else{
            setIsMyPage(false)
        }
    }, [id, sessionUser]);

    function IsUserFollow(){
        setSessionUserFollow()
        follower.map((userFollow)=>
            {console.log(userFollow.user.userId);
                if(userFollow.user.userId==sessionUser){
                setSessionUserFollow(userFollow.id)
                return
            }}
        )
    }

    async function GetUser(){
        try{
            const response = await axios.post("http://localhost:8080/api/sendUser", {userId: id});
            const data = response.data;
            console.log("GetUser", data);
            setUser(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFeedList(){
        try{
            const response = await axios.post("http://localhost:8080/api/feed/id", {userId: id});
            const data = response.data;
            console.log("GetFeedList", data);
            setFeedList(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFollower(){
        try{
            const response = await axios.post("http://localhost:8080/api/userFollow/user2", {userId: id});
            const data = response.data;
            console.log("GetFollower", data);
            setFollower(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFollowing(){
        try{
            const response = await axios.post("http://localhost:8080/api/userFollow/user", {userId: id});
            const data = response.data;
            console.log("GetFollowing", data);
            setFollowing(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
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
            }else{
                const response = await axios.post("http://localhost:8080/api/userFollow", {user:{userId: sessionUser}, user2:{userId: id}});
                const data = response.data;
                console.log("FollowClick", data)
                setFollowChange(!followChange);
            }
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function IsTeacher(){
        try{
            const response = await axios.post("http://localhost:8080/api/userIsTeacher", {userId: id});
            const data = response.data;
            console.log("IsTeacher", data);
            setTeacher(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    return <Container>
        {user? <div><div style={{display:"flex", flexDirection:"column", alignItems:"center", width:"100%"}}>
            <Flex style={{marginBottom:"20px", gap:"10%", width:"100%"}}>
                <div style={{width:"200px", height:"200px"}}>
                    <ProfileImg src={user.data? getServerImgFile(user.data): defaltUserImg}/>
                </div>
                {follower && following && feedList? <FlexC style={{width:"100%"}}>
                    <Flex style={{gap: "50px", fontSize: "20px", justifyContent:"space-between"}}>
                        <FlexC style={{gap: "10px", alignItems:"center"}}>
                            <div>Feed</div>
                            <div>{feedList.length}</div>
                        </FlexC>
                        <Tooltip tooltipContents={FollowerTooltip(follower, ()=>{setFollowChange(!followChange)})}>
                            <FlexC style={{gap: "10px", alignItems:"center", cursor:"pointer"}}>
                                <div>Follower</div>
                                <div>{follower.length}</div>
                            </FlexC>
                        </Tooltip>
                        <Tooltip tooltipContents={FollowingTooltip(following, ()=>{setFollowChange(!followChange)})}>
                            <FlexC style={{gap: "10px", alignItems:"center", cursor:"pointer"}}>
                                <div>Following</div>
                                <div>{following.length}</div>
                            </FlexC>
                        </Tooltip>
                        <Flex>
                            {isMyPage? <Btn onClick={()=>{navigate("/mypage/profile")}}>프로필 편집</Btn> :<Btn onClick={()=>{FollowClick()}}>{sessionUserFollow? "following": "follow"}</Btn>}
                            {/* {teacher? <Btn onClick={()=>{navigate("/teacher/"+teacher.id)}}>lecture page</Btn>: null} */}
                        </Flex>
                    </Flex>
                    <div style={{fontSize:"30px", fontWeight:"bold", marginTop:"20px"}}>{id}</div>
                    <ProfileText>{user.profileText}</ProfileText>
                </FlexC>: null}
            </Flex></div>
            <div style={{borderTop:"1px solid white", margin:"30px 0"}}></div>
            <FeedContainer>
                {feedList && feedList.map((feed, index)=>(
                    <Img key={index} src={feed.imageData? getServerImgFile(feed.imageData): feed.image} onClick={()=>{navigate("/feed/"+feed.id)}}/>
                ))}
            </FeedContainer>
            <FeedTab/>
        </div>: <Loading/>}
    </Container>
}