import styled from "styled-components";
import { FollowerTooltip, FollowingTooltip, formatDate, LikeTooltip, Loading, MyFeedTooltip, ScrollableContent, Title, Tooltip } from "./Styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FeedEdit } from "./FeedEdit";
import { SessionCurrent } from "./SessionCurrent";
import { getServerImgFile } from "./File";
import heart from "./../img/favorite.png";
import redheart from "./../img/favoriteCheck.png";
import bookmark from "./../img/bookmarkFeed.png";
import blackbookmark from "./../img/bookmarkFeedCheck.png";
import closeBtn from "./../img/x.png";
import defaltUserImg from "./../img/defaltUserImg.png";
import { FeedTab } from "./FeedTab";

const SearchBox = styled.div`
    display: flex;
    gap: 5px;
    margin-bottom: 30px;
    width: 50%;
    margin: auto;
`

const Input = styled.input`
    background-color: black;
    border: 1px solid white;
    border-radius: 5px;
    padding: 10px 10px;
    font-size: 15px;
    color: white;
    flex: 1;
`

const SearchBtn = styled.div`
    font-size: 15px;
    padding: 10px 20px;
    background-color: #561689;
    border: 1px solid white;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        transform: scale(1.01);
    }
`

export function FeedHome(){
    const [search, setSearch] = useState([]);
    const [feedList, setFeedList] = useState([]);
    const [feedSearchList, setFeedSearchList] = useState([]);
    const { sessionUser } = SessionCurrent();
    const [userList, setUserList] = useState([]);
    const [userSearchList, setUserSearchList] = useState([]);

    useEffect(() => {
        getAllUser()
    }, []);

    async function getAllUser(){
        try{
            const response = await axios.get("http://localhost:8080/api/allUser");
            const data = response.data;
            console.log("getAllUser", data);
            setUserList(data);
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    useEffect(() => {
        getAllFeed()
    }, []);

    async function getAllFeed(){
        try{
            const response = await axios.get("http://localhost:8080/api/feed");
            const data = response.data;
            // console.log("getAllFeed", data);
            setFeedList(data);
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    function SearchBtnClick(){
        if(search==""){
            setFeedSearchList([])
            setUserSearchList([])
        }else{
            const filteredFeeds = feedList.filter((feed) => 
                feed.user.userId.includes(search) || feed.text.includes(search)
            );
            const filteredUsers = userList.filter((user) => 
                user.userId.includes(search) || user.profileText.includes(search)
            );
            setUserSearchList(filteredUsers);
            setFeedSearchList(filteredFeeds);

            if(filteredFeeds.length == 0 && filteredUsers.length == 0){
                alert("'"+search+"'에 대한 검색결과가 없습니다.");
            }

            
        }
    }

    return <>
        {sessionUser?<div style={{padding: '0 50px'}}>
            <SearchBox>
                <Input type="text" placeholder="Search for users or feeds" onChange={(e)=> {setSearch(e.target.value)}} />
                <SearchBtn onClick={()=>{SearchBtnClick()}}>Search</SearchBtn>
            </SearchBox>
            <UserBar userList={userSearchList.length > 0 ? userSearchList : userList} sessionUser={userSearchList.length > 0 ? null : sessionUser} />
            <FeedBar feedList={feedSearchList.length > 0 ? feedSearchList : feedList} sessionUser={feedSearchList.length > 0 ? null : sessionUser} />
            <FeedTab/>
        </div>:<Loading/>}
    </>
}

const UserBox = styled.div`
    width: 50%;
    padding: 0 10px 5px 10px;
    background: linear-gradient(to right, rgba(86, 22, 137, 0.5), rgba(0, 128, 128, 0.5));
    border-radius: 5px;
    margin: 10px auto;
`
const FeedUserBar = styled.div`
    display: flex;
    gap: 10px;
`

export function UserBar({ userList, sessionUser }){
    return <>
        <UserBox>
            <ScrollableContent>
                <FeedUserBar>
                    {userList.map((user)=>(
                        user.userId==sessionUser? null: <UserContainer key={user.id} user={user}/>
                    ))}
                </FeedUserBar>
            </ScrollableContent>
        </UserBox>
    </>
}

const UserImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`
const UserBarFlex = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
`
function UserContainer({ user }){
    const navigate = useNavigate();

    return <UserBarFlex onClick={()=>{navigate("/feed/user/"+user.userId)}}>
        <UserImg src={user.data? getServerImgFile(user.data): user.profileImg}/>
        <div>{user.userId}</div>
    </UserBarFlex>
}


function FeedBar({ feedList, sessionUser }){
    return <>
        {
          feedList.map((feed)=>(
            feed.user.userId==sessionUser?null:<FeedContainer key={feed.id} feed={feed}/>
          ))
        }
    </>
}

const Container = styled.div`
    width: 50%;
    margin: auto;
`

const Contents = styled.div`
    border: 1px solid white;
`

const Flex = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`

const ProfileImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
`

const FollowerBtn = styled.div`
    background-color: #25559B;
    color: white;
    border-radius: 5px;
    padding: 5px;
    border: 2px solid black;
    cursor: pointer;
    &:hover {
        transform: scale(1.01);
    }
`

const FollowingBtn = styled.div`
    background-color: white;
    color: black;
    border-radius: 5px;
    padding: 5px;
    border: 2px solid black;
    cursor: pointer;
    &:hover {
        transform: scale(1.01);
    }
`
const FeedBox = styled.div`
    
`
const FeedImg = styled.img`
    cursor: pointer;
    width: 100%;
    &:hover {
        transform: scale(1.01);
    }
`

export function FeedContainer({feed}) {
    const [follower, setFollower] = useState();
    const [following, setFollowing] = useState();
    const { sessionUser } = SessionCurrent();
    const [scrap, setScrap] = useState(false);
    const [like, setLike] = useState(false);
    const [likeList, setLikeList] = useState();
    const navigate = useNavigate();
    const [sessionUserFollow, setSessionUserFollow] = useState();
    const [followChange, setFollowChange] = useState(false);
    const [feedEdit, setFeedEdit] = useState(false);

    useEffect(() => {
        if(feed){
            GetFollower()
            GetFollowing()
        }
    }, [followChange]);

    useEffect(() => {
        if(sessionUser){
            GetFeedScrap()
            GetFeedLike()
        }
    }, [sessionUser]);

    useEffect(() => {
        if(feed){
            GetFeedLikeList()
        }
    }, [like]);

    useEffect(() => {
        if(sessionUser && follower){
            IsUserFollow()
        }
    }, [sessionUser, follower]);

    function IsUserFollow(){
        setSessionUserFollow()
        follower.map((userFollow)=>
            {
            // console.log(userFollow.user.userId);
                if(userFollow.user.userId==sessionUser){
                setSessionUserFollow(userFollow.id)
                return
            }}
        )
    }

    async function GetFollower(){
        try{
            const response = await axios.post("http://localhost:8080/api/userFollow/user2", {userId: feed.user.userId});
            const data = response.data;
            // console.log("GetFollower", data);
            setFollower(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFollowing(){
        try{
            const response = await axios.post("http://localhost:8080/api/userFollow/user", {userId: feed.user.userId});
            const data = response.data;
            // console.log("GetFollowing", data);
            setFollowing(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFeedScrap(){
        try{
            const response = await axios.post("http://localhost:8080/api/checkFeedScrapClick", {user:{userId: sessionUser}, feed:{id:feed.id}});
            const data = response.data;
            // console.log("GetFeedScrap", data);
            setScrap(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFeedLike(){
        try{
            const response = await axios.post("http://localhost:8080/api/checkFeedLikeClick", {user:{userId: sessionUser}, feed:{id:feed.id}});
            const data = response.data;
            // console.log("GetFeedLike", data);
            setLike(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFeedLikeList(){
        try{
            const response = await axios.post("http://localhost:8080/api/getFeedLike", {id:feed.id});
            const data = response.data;
            // console.log("GetFeedLikeList", data);
            setLikeList(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function ScrapClick(){
        if(sessionUser=="anonymousUser"){
            const result = window.confirm("로그인이 필요한 서비스입니다. 로그인 창으로 이동할까요?");
            if (result) {
                window.location.href = '/login';
            }
            return;
        }

        try{
            if(scrap){
                const response = await axios.delete("http://localhost:8080/api/feedScrap", {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        user: { userId: sessionUser },
                        feed: { id: feed.id }
                    }
                });
                const data = response.data;
                // console.log(data)
                setScrap(!scrap);
            }else{
                const response = await axios.post("http://localhost:8080/api/feedScrap", {user:{userId: sessionUser}, feed:{id:feed.id}});
                const data = response.data;
                // console.log(data)
                setScrap(!scrap);
            }
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function LikeClick(){
        if(sessionUser=="anonymousUser"){
            const result = window.confirm("로그인이 필요한 서비스입니다. 로그인 창으로 이동할까요?");
            if (result) {
                window.location.href = '/login';
            }
            return;
        }

        try{
            if(like){
                const response = await axios.delete("http://localhost:8080/api/feedLike", {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        user: { userId: sessionUser },
                        feed: { id: feed.id }
                    }
                });
                const data = response.data;
                // console.log(data)
                setLike(!like);
            }else{
                const response = await axios.post("http://localhost:8080/api/feedLike", {user:{userId: sessionUser}, feed:{id:feed.id}});
                const data = response.data;
                // console.log(data)
                setLike(!like);
            }
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
                // console.log("FollowClick", data)
                setFollowChange(!followChange);
            }else{
                const response = await axios.post("http://localhost:8080/api/userFollow", {user:{userId: sessionUser}, user2:{userId: feed.user.userId}});
                const data = response.data;
                // console.log("FollowClick", data)
                setFollowChange(!followChange);
            }
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    return <>
        {follower && following? <div style={{padding:"5px 0"}}>
            <Container>
                <Contents>
                    <Flex style={{padding: "15px 30px", justifyContent:"space-between"}}>
                        <Flex>
                            <ProfileImg src={feed.user.data? getServerImgFile(feed.user.data): defaltUserImg} onClick={()=>{navigate("/feed/user/"+feed.user.userId)}}/>
                            <div>
                                <Flex>
                                    <div style={{fontSize: "20px", fontWeight: "bold"}}>{feed.user.userId}</div>
                                    <Tooltip tooltipContents={FollowerTooltip(follower, ()=>{setFollowChange(!followChange)})}>
                                        <div style={{cursor:"pointer"}}>팔로워 {follower.length}명</div>
                                    </Tooltip>
                                    <Tooltip tooltipContents={FollowingTooltip(following, ()=>{setFollowChange(!followChange)})}>
                                        <div style={{cursor:"pointer"}}>팔로잉 {following.length}명</div>
                                    </Tooltip>
                                </Flex>
                                <div>{formatDate(feed.createdAt)} 업로드</div>
                            </div>
                        </Flex>
                        {sessionUser!=feed.user.userId? sessionUserFollow? <FollowingBtn onClick={()=>{FollowClick()}}>팔로잉</FollowingBtn>: 
                            <FollowerBtn onClick={()=>{FollowClick()}}>팔로우</FollowerBtn>: null
                        }
                    </Flex>

                    <FeedImg src={feed.imageData? getServerImgFile(feed.imageData): feed.image} onClick={()=>{navigate("/feed/"+feed.id)}}/>
                    <div style={{padding: "15px 30px"}}>
                        <Flex>
                            <img src={like? redheart: heart} style={{height: "25px", cursor:"pointer"}} onClick={()=>{LikeClick()}}/>
                            <Tooltip tooltipContents={LikeTooltip(likeList, ()=>{setFollowChange(!followChange)})} bottom="true">
                                <div style={{marginLeft:"-10px", cursor:"pointer"}}>{likeList? likeList.length: "0"}</div>
                            </Tooltip>
                            <img src={scrap? blackbookmark: bookmark} style={{height: "25px", cursor:"pointer"}} onClick={()=>{ScrapClick()}}/>
                        </Flex>
                        <div style={{marginTop: "10px", whiteSpace: "pre-line"}}>{feed.text}</div>
                    </div>
                </Contents>
            </Container>
        </div>: null}
    </>
}