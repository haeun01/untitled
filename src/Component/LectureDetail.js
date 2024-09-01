import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 스타일 컴포넌트 (기존 코드 유지)
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
  max-width: 1500px;
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
  max-width: 1500px;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
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
`;

const ChatSection = styled.div`
  width: 400px;
  height: 600px;
  background-color: white;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  box-sizing: border-box;
`;

const ChatButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

export function LectureDetail() {
  const { id } = useParams(); // URL에서 강의 ID 가져오기
  const [lectureData, setLectureData] = useState(null); // 강의 데이터를 저장할 상태
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지를 저장할 상태
  const [message, setMessage] = useState(""); // 입력한 메시지 상태
  const stompClient = useRef(null);

  useEffect(() => {
    // 강의 데이터 가져오기
    axios.get(`/api/lecture/${id}`)
      .then(response => {
        setLectureData(response.data);
        setChatMessages(response.data.chatMessages || []);
      })
      .catch(error => {
        console.error("Error fetching lecture data:", error);
      });

    // WebSocket 연결 설정
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/topic/public`, (messageOutput) => {
        const receivedMessage = JSON.parse(messageOutput.body);
        setChatMessages(prevMessages => [...prevMessages, receivedMessage.content]);
      });
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [id]);

  const sendMessage = () => {
    if (stompClient.current && message.trim() !== "") {
      const chatMessage = {
        sender: "User", // 임의의 사용자 이름 사용 또는 로그인 사용자 이름 사용
        content: message,
        type: "CHAT"
      };
      stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      setMessage(""); // 입력란 초기화
    }
  };

  return (
    <Container>
      <TitleBar>
        <VideoTitle>{lectureData && lectureData ? lectureData.lecture_name : 'Loading...'} 👀</VideoTitle>
      </TitleBar>
      <ContentArea>
        <VideoPlayer>
          {lectureData ? (
            <video width="100%" height="100%" controls>
              <source src={lectureData.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>Loading Video...</p>
          )}
        </VideoPlayer>
        <ChatSection>
          {chatMessages.length > 0 ? (
            chatMessages.map((message, index) => (
              <p key={index}>{message}</p>
            ))
          ) : (
            <p>Loading Chat...</p>
          )}
          <ChatInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <ChatButton onClick={sendMessage}>Send</ChatButton>
        </ChatSection>
      </ContentArea>
    </Container>
  );
}
