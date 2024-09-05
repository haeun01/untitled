import styled from "styled-components";
import { ScrollableContent, Title } from "./Styles";
import { PopupContainer } from "./PopupContainer";
import axios from "axios";
import { SessionCurrent } from "./SessionCurrent";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getServerImgFile } from "./File";

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    padding: 50px;
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

export function FeedList() {
    const location = useLocation();
    const { sessionUser } = SessionCurrent();
    const [feedList, setFeedList] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionUser) {
            if(location.pathname=="/mypage/scrap"){
                GetScrapList();
            }
            if(location.pathname=="/mypage/like"){
                GetLikeList();
            }
        }
    }, [sessionUser, location]);

    async function GetScrapList(){
        try{
            const response = await axios.post("http://localhost:8080/api/feedScrap/user", {userId: sessionUser});
            const data = response.data;
            console.log(data);
            setFeedList(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    async function GetLikeList(){
        try{
            const response = await axios.post("http://localhost:8080/api/getFeedLikeByUser", {userId: sessionUser});
            const data = response.data;
            console.log(data);
            setFeedList(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }
    
    return <>
        <ScrollableContent height="100%">
            <Title style={{padding: "20px"}}>Feed {location.pathname=="/mypage/scrap"? "Scrap": "Like"}</Title>
            <Container>{
                feedList && feedList.map((data, index)=>(
                    <Img key={index} src={data.feed.imageData? getServerImgFile(data.feed.imageData): data.feed.image} onClick={()=>{navigate("/feed/"+data.feed.id)}}/>
                ))
            }</Container>
        </ScrollableContent>
    </>
}
