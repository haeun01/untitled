import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom"; 
import axios from "axios"; 

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  background-color: black;
  padding: 30px; /* 패딩을 약간 확대 */
  box-sizing: border-box;
`;

const TitleBar = styled.div`
  width: 100%;
  max-width: 1500px; /* 최대 너비 증가 */
  text-align: left;
  margin-bottom: 30px; /* 하단 여백 증가 */
`;

const VideoTitle = styled.h1`
  color: white;
  font-weight: 300;
  font-size: 40px; /* 글자 크기 증가 */
  margin: 0;
`;

const ContentArea = styled.div`
  display: flex;
  width: 100%;
  max-width: 1500px;
  justify-content: space-between; /* 요소들을 양쪽 끝에 정렬 */
  align-items: flex-start; /* 상단 정렬 */
  gap: 30px; /* 요소 간의 간격 증가 */
`;

const VideoPlayer = styled.div`
  flex: 4;
  width: 850px; /* 비디오 플레이어의 고정 너비 증가 */
  height: 600px; /* 비디오 플레이어의 고정 높이 증가 */
  background-color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  /* margin-right: 20px;  */
`;

const ChatSection = styled.div`
  /* flex: 2; */
  width: 400px; /* 채팅 섹션의 고정 너비 증가 */
  height: 600px; /* VideoPlayer와 동일한 높이로 설정 */
  background-color: white;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

export function LectureDetail() {
  const { id } = useParams(); 
  const [videoData, setVideoData] = useState(null); // 비디오 데이터를 저장할 상태
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지를 저장할 상태

  useEffect(() => {
    axios.get(`/api/lecture/${id}`)
      .then(response => {
        setVideoData(response.data.videoUrl); // 비디오 URL 설정
        setChatMessages(response.data.chatMessages); // 초기 채팅 메시지 설정
      })
      .catch(error => {
        console.error("Error fetching lecture data:", error);
      });
  }, [id]);

  return (
    <Container>
      <TitleBar>
        <VideoTitle>Lecture {id} 👀</VideoTitle>
      </TitleBar>
      <ContentArea>
        <VideoPlayer>
          {videoData ? (
            <video width="100%" height="100%" controls>
              <source src={videoData} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>Loading Video...</p>
          )}
        </VideoPlayer>
        <ChatSection>
          {/* 실시간 채팅 공간 */}
          {chatMessages.length > 0 ? (
            chatMessages.map((message, index) => (
              <p key={index}>{message}</p>
            ))
          ) : (
            <p>Loading Chat...</p>
          )}
        </ChatSection>
      </ContentArea>
    </Container>
  );
}
