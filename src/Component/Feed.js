import styled from "styled-components";
import { FollowerTooltip, FollowingTooltip, LikeTooltip, Loading, MyFeedTooltip, ScrollableContent, Title, Tooltip } from "./Styles";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import heart from "./../img/favorite.png";
import redheart from "./../img/favoriteCheck.png";
import bookmark from "./../img/bookmarkFeed.png";
import blackbookmark from "./../img/bookmarkFeedCheck.png";
import closeBtn from "./../img/x.png";
import { SessionCurrent } from "./SessionCurrent";
import { getServerImgFile } from "./File";
import defaltUserImg from "./../img/defaltUserImg.png";
import { FeedEdit } from "./FeedEdit";

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 30px;
    gap: 30px;
`

const Contents = styled.div`
    border: 1px solid white;
`

const CommentBox = styled.div`
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
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

const Input = styled.input`
    width: 100%;
    padding: 10px 20px;
    background-color: black;
    color: white;
    border: 1px solid white;
`

const CommentBtn = styled.div`
    background-color: white;
    color: black;
    padding: 10px;
    width: 150px;
    text-align: center;
    /* border: 1px solid #333; */
    /* border-radius: 3px; */
    cursor: pointer;
    margin-left: 20px;
`

const InputComment = styled.input`
    width: 100%;
    padding: 5px 20px;
    background-color: black;
    color: white;
    border: 1px solid white;
    margin: 10px 0;
`

const CommentBtnComment = styled.div`
    background-color: white;
    color: black;
    padding: 5px;
    width: 150px;
    text-align: center;
    margin: 10px 0;
    /* border: 1px solid #333; */
    /* border-radius: 3px; */
    cursor: pointer;
    margin-left: 20px;
`

const FollowerBtn = styled.div`
    background-color: #25559B;
    color: white;
    border-radius: 5px;
    padding: 5px;
    border: 2px solid black;
    cursor: pointer;
`

const FollowingBtn = styled.div`
    background-color: white;
    color: black;
    border-radius: 5px;
    padding: 5px;
    border: 2px solid black;
    cursor: pointer;
`

export function Feed() {
    const { id } = useParams();
    const [feed, setFeed] = useState();
    const [follower, setFollower] = useState();
    const [following, setFollowing] = useState();
    const { sessionUser } = SessionCurrent();
    const [scrap, setScrap] = useState(false);
    const [like, setLike] = useState(false);
    const [likeList, setLikeList] = useState();
    const [commentList, setCommentList] = useState();
    const [commentPost, setCommentPost] = useState(false);
    const navigate = useNavigate();
    const [sessionUserFollow, setSessionUserFollow] = useState();
    const [followChange, setFollowChange] = useState(false);
    const [feedEdit, setFeedEdit] = useState(false);

    useEffect(() => {
        GetFeed()
    }, [id]);

    useEffect(() => {
        if(feed){
            GetFollower()
            GetFollowing()
        }
    }, [feed, followChange]);

    useEffect(() => {
        if(feed&&sessionUser){
            GetFeedScrap()
            GetFeedLike()
        }
    }, [feed, sessionUser]);

    useEffect(() => {
        if(feed){
            GetFeedLikeList()
        }
    }, [like, feed]);

    useEffect(() => {
        if(feed){
            GetFeedCommentList()
        }
    }, [feed, commentPost]);

    useEffect(() => {
        if(sessionUser && follower){
            IsUserFollow()
        }
    }, [sessionUser, follower]);

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

    async function GetFeed(){
        try{
            const response = await axios.post("http://localhost:8080/api/feed/feed", {id: id});
            const data = response.data;
            // console.log(data);
            setFeed(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
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
            console.log("GetFeedLikeList", data);
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


    async function GetFeedCommentList(){
        try{
            const response = await axios.post("http://localhost:8080/api/getFeedComment", {id:feed.id});
            const data = response.data;
            // console.log("GetFeedCommentList", data);
            setCommentList(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    let commentText;

    async function CommentPost(){
        if(sessionUser=="anonymousUser"){
            const result = window.confirm("로그인이 필요한 서비스입니다. 로그인 창으로 이동할까요?");
            if (result) {
                window.location.href = '/login';
            }
            return;
        }

        try{
            const response = await axios.post("http://localhost:8080/api/feedComment", {feed: {id:feed.id}, user: {userId: sessionUser}, text: commentText});
            const data = response.data;
            console.log("CommentPost", data);
            setCommentPost(!commentPost);
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
                const response = await axios.post("http://localhost:8080/api/userFollow", {user:{userId: sessionUser}, user2:{userId: feed.user.userId}});
                const data = response.data;
                console.log("FollowClick", data)
                setFollowChange(!followChange);
            }
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    return <>
        {feed && follower && following? <div style={{padding:"0 50px"}}>
            {feedEdit? <div><FeedEdit feed={feed}/></div>:
            <Container><div>
                <div style={{fontSize:"20px", fontWeight:"bold", cursor:"pointer", padding:"0 0 10px 0", width:"10px"}} onClick={()=>{navigate(-1)}}>Back</div>
                <Contents>
                    <Flex style={{padding: "20px 30px", justifyContent:"space-between"}}>
                        <Flex>
                            <div style={{width:"50px", height:"50px"}}>
                                <ProfileImg src={feed.user.data? getServerImgFile(feed.user.data): defaltUserImg} onClick={()=>{navigate("/feed/user/"+feed.user.userId)}}/>
                            </div>
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
                                <div>{feed.createdAt}업로드</div>
                            </div>
                        </Flex>
                        {sessionUser!=feed.user.userId? sessionUserFollow? <FollowingBtn onClick={()=>{FollowClick()}}>팔로잉</FollowingBtn>: 
                            <FollowerBtn onClick={()=>{FollowClick()}}>팔로우</FollowerBtn>: 
                            <Tooltip tooltipContents={MyFeedTooltip(feed, ()=>{navigate(-1)}, ()=>{setFeedEdit(!feedEdit)})}><FollowerBtn>...</FollowerBtn></Tooltip>
                        }
                    </Flex>

                    <img src={feed.imageData? getServerImgFile(feed.imageData): feed.image} style={{width: "100%"}}/>
                    <div style={{padding: "20px 30px"}}>
                        <Flex>
                            <img src={like? redheart: heart} style={{height: "25px", cursor:"pointer"}} onClick={()=>{LikeClick()}}/>
                            <Tooltip tooltipContents={LikeTooltip(likeList, ()=>{setFollowChange(!followChange)})} bottom="true">
                                <div style={{marginLeft:"-10px", cursor:"pointer"}}>{likeList? likeList.length: "0"}</div>
                            </Tooltip>
                            <img src={scrap? blackbookmark: bookmark} style={{height: "25px", cursor:"pointer"}} onClick={()=>{ScrapClick()}}/>
                        </Flex>
                        <div style={{marginTop: "20px"}}>{feed.text}</div>
                    </div>
                </Contents></div>
                <div>
                    <CommentBox>
                        <div>
                            <div style={{padding:"20px 0", fontSize:"35px"}}>Comments {commentList? commentList.length: ""}</div>
                            <ScrollableContent width="100%" height="600px">
                                {commentList && commentList.map((comment, index)=> comment.feedComment==null?(
                                    <FeedCommentBar key={comment.id} comment={comment} func={() => setCommentPost(!commentPost)}/>
                                ):null)}
                            </ScrollableContent>
                        </div>
                        <Flex style={{gap: "0"}}>
                            <Input type="text" placeholder="Enter Comment" onChange={(e)=> {commentText = e.target.value}}/>
                            <CommentBtn onClick={()=>{CommentPost()}}>SEND</CommentBtn>
                        </Flex>
                    </CommentBox>
                </div>
            </Container>}
        </div>: <Loading/>}
    </>
}

const FeedCommentContainer = styled.div`
    /* background-color: #ccc; */
    border-radius: 5px;
    /* padding: 10px; */
    width: 100%;
    margin-top: 15px;
    margin-bottom: 15px;
`

const Img = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
`

export function FeedCommentBar({comment, func}){
    const navigate = useNavigate();
    const { sessionUser } = SessionCurrent();
    const [commentList, setCommentList] = useState();
    const [like, setLike] = useState(false);
    const [likeList, setLikeList] = useState();
    const [commentLook, setCommentLook] = useState(false);
    const [commentWriteLook, setCommentWriteLook] = useState(false);
    const [commentPost, setCommentPost] = useState(false);
    const [commentDelete, setCommentDelete] = useState(false);

    const commentInputRef = useRef(null);
    
    const handleClickOutside = (event) => {
        if (commentInputRef.current && !commentInputRef.current.contains(event.target)) {
            setCommentWriteLook(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    
    useEffect(() => {
        getFeedCommentByFeedComment()
    }, [commentPost]);

    useEffect(() => {
        if(sessionUser){
            GetFeedLike()
        }
    }, [sessionUser]);

    useEffect(() => {
        GetFeedLikeList()
    }, [like]);
    
    async function getFeedCommentByFeedComment(){
        try{
            const response = await axios.post("http://localhost:8080/api/getFeedCommentByFeedComment", {id:comment.id});
            const data = response.data;
            console.log("GetFeedCommentList2", data);
            setCommentList(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }    
    
    async function GetFeedLike(){
        try{
            const response = await axios.post("http://localhost:8080/api/checkFeedCommentLikeClick", {user:{userId: sessionUser}, feedComment:{id:comment.id}});
            const data = response.data;
            // console.log("GetFeedLike", data);
            setLike(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetFeedLikeList(){
        try{
            const response = await axios.post("http://localhost:8080/api/numberOfFeedCommentLike", {id:comment.id});
            const data = response.data;
            // console.log("GetFeedLike", data);
            setLikeList(data)
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
                const response = await axios.delete("http://localhost:8080/api/feedCommentLike", {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        user: { userId: sessionUser },
                        feedComment:{id: comment.id}
                    }
                });
                const data = response.data;
                // console.log(data)
                setLike(!like);
            }else{
                const response = await axios.post("http://localhost:8080/api/feedCommentLike", {user:{userId: sessionUser}, feedComment:{id:comment.id}});
                const data = response.data;
                // console.log(data)
                setLike(!like);
            }
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    let commentText;

    async function CommentPost(){
        if(sessionUser=="anonymousUser"){
            const result = window.confirm("로그인이 필요한 서비스입니다. 로그인 창으로 이동할까요?");
            if (result) {
                window.location.href = '/login';
            }
            return;
        }

        try{
            const response = await axios.post("http://localhost:8080/api/feedComment", {feed: {id: comment.feed.id}, user: {userId: sessionUser}, text: commentText, feedComment: {id: comment.id}});
            const data = response.data;
            console.log("CommentPost", data);
            setCommentPost(!commentPost);
            func();
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function CommentDelete(){
        try{
            const response = await axios.post("http://localhost:8080/api/deleteFeedComment", {id: comment.id});
            const data = response.data;
            console.log("CommentDelete", data);
            setCommentDelete(true);
            func();
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }
    
    return <>
        {commentDelete? <div/>: <FeedCommentContainer>
            <Flex style={{alignItems:"start"}}>
                <div style={{width:"50px", height:"50px"}}>
                    <Img src={comment.user.data? getServerImgFile(comment.user.data): defaltUserImg} onClick={()=>{navigate("/feed/user/"+comment.user.userId)}}/>
                </div>
                <div style={{width: "100%"}}>
                    <Flex style={{gap: "5px", marginBottom: "5px"}}>
                        <div>{comment.user.userId}</div>
                        <div style={{fontSize: "10px", color: "gray"}}>{comment.createdAt}</div>
                    </Flex>
                    <Flex style={{justifyContent: "space-between"}}>
                        <div>
                            <div>{comment.text}</div>
                            <Flex>
                                <Flex style={{gap: "5px"}}>
                                    <img src={like? redheart: heart} style={{height: "15px", cursor:"pointer"}} onClick={()=>{LikeClick()}}/>
                                    <div style={{fontSize: "14px"}}>{likeList? likeList: "0"}</div>
                                </Flex>
                                <div style={{fontSize: "12px", color: "gray", marginTop: "5px", cursor:"pointer"}} onClick={()=>{setCommentWriteLook(!commentWriteLook)}}>Reply</div>
                                {commentList? commentList.length!=0? 
                                    (<div style={{fontSize: "12px", color: "#561689", fontWeight:"bold", marginTop: "5px", cursor:"pointer"}} onClick={()=>{setCommentLook(!commentLook)}}>
                                    {commentLook? "↑Close": "↓Replies("+commentList.length+"개)"}</div>): null: null
                                }
                            </Flex>
                        </div>
                        {comment.user.userId==sessionUser? <img src={closeBtn} style={{height: "25px", cursor:"pointer", marginRight:"20px"}} onClick={()=>{CommentDelete()}}/>: null}
                    </Flex>
                    {commentWriteLook? <Flex ref={commentInputRef} style={{gap: "0"}}>
                        <InputComment type="text" placeholder="Enter Comment" onChange={(e)=> {commentText = e.target.value}}/>
                        <CommentBtnComment onClick={()=>{CommentPost()}}>SEND</CommentBtnComment>
                    </Flex>: null}
                    {commentLook? commentList.map((comment, index)=> (
                        <FeedCommentBar key={comment.id} comment={comment} func={func}/>
                    )): null}
                </div>
            </Flex>
        </FeedCommentContainer>}
    </>
}
