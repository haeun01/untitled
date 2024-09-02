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
  padding: 55px;
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
  const [user, setUser] = useState(null); // 현재 로그인한 사용자 정보
  const stompClient = useRef(null);

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    axios.get("/api/current")
      .then(response => {
        setUser(response.data); // 사용자 정보 설정
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });

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
    
    // 디버깅을 위한 STOMP 클라이언트 로깅 활성화
    stompClient.current.debug = (str) => {
      console.log(str);
    };

    // STOMP 연결 설정
    stompClient.current.connect({}, () => {
      console.log("Connected to WebSocket server");
      // 구독을 제거해도, 서버와의 연결은 유지됨
    }, (error) => {
      console.error("STOMP connection error:", error);
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log("Disconnected from WebSocket server");
        });
      }
    };
  }, [id]);

  const sendMessage = () => {
    if (stompClient.current && stompClient.current.connected && message.trim() !== "" && user) {
      const chatMessage = {
        senderId: user.userId, // 로그인된 사용자의 ID
        content: message,
      };
      stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      setMessage(""); 
      setChatMessages(prevMessages => [...prevMessages, chatMessage]); // 메시지 바로 추가
    } else {
      console.error("STOMP client is not connected or message is empty.");
    }
  };

  return (
    <Container>
      <TitleBar>
        <VideoTitle>{lectureData ? lectureData.lectureName : 'Loading...'}</VideoTitle>
      </TitleBar>
      <ContentArea>
        <VideoPlayer>
          {lectureData ? (
            <video width="100%" height="100%" controls poster={lectureData.image}>
              <source src={lectureData.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>Loading Video...</p>
          )}
        </VideoPlayer>
        <ChatSection>
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <p key={index}><strong>{msg.senderName}:</strong> {msg.content}</p>
            ))
          ) : (
            <p>No chat messages</p>
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
