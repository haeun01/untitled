// LectureDetail.js
import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom"; // URL에서 매개변수를 가져오기 위한 훅

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  background-color: black;
  padding: 30px;
  box-sizing: border-box;
`;

const TitleBar = styled.div`
  width: 100%;
  max-width: 1300px; 
  text-align: left;
  margin-bottom: 30px;
`;

const VideoTitle = styled.h1`
  color: white;
  font-weight: 300;
  font-size: 40px;
  margin: 0;
`;

const ContentArea = styled.div`
  display: flex;
  width: 100%;
  max-width: 1300px; 
  justify-content: space-between; 
  align-items: flex-start; 
  gap: 30px; 

  @media (min-width: 1200px) {
    justify-content: space-between;
  }
`;

const VideoPlayer = styled.div`
  flex: 4;
  width: 850px; 
  height: 600px; 
  background-color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 5px; 
`;

const ChatSection = styled.div`
  flex: 2;
  width: 400px; 
  height: 600px; 
  background-color: white;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

export function LectureDetail() {
  const { id } = useParams(); // URL에서 강의 ID를 가져옴

  return (
    <Container>
      <TitleBar>
        <VideoTitle>Lecture {id} 👀</VideoTitle>
      </TitleBar>
      <ContentArea>
        <VideoPlayer>
          <p>Play Video</p> {/* 실제 비디오를 사용할 경우 video 태그로 대체 */}
        </VideoPlayer>
        <ChatSection>
          {/* 실시간 채팅 공간 */}
        </ChatSection>
      </ContentArea>
    </Container>
  );
}
