import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 스타일 컴포넌트
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
  background-color: #333;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
`;

const ChatInput = styled.input`
  flex: 1;
  height: 30px;
  padding-left: 10px;
  margin-top: 10px;
  margin-right: 5px;
  background-color: #666;
  box-sizing: border-box;
  /* border: 1px solid black; */
  color: black;
`;

const ChatButton = styled.button`
  width: 80px;
  height: 30px;
  margin-top: 10px;
  background-color: #561689;
  color: white;
  border: none;
  cursor: pointer;
`;

const ChatControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: absolute;
  bottom: 20px;
  left: 0;
  padding: 0 20px;
  box-sizing: border-box;
`;

export function LectureDetail() {
  const { id } = useParams(); // URL에서 강의 ID 가져오기
  const [lectureData, setLectureData] = useState(null); // 강의 데이터를 저장할 상태
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지를 저장할 상태
  const [message, setMessage] = useState(""); // 입력한 메시지 상태
  const [user, setUser] = useState(null); // 현재 로그인한 사용자 정보
  const stompClient = useRef(null);

  //이모티콘의 위치를 상태로 관리
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 마우스 이동 이벤트 리스너 등록
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.pageX + 4, y: e.pageY + 4 });
    };
    document.addEventListener("mousemove", handleMouseMove);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    axios
      .get("/api/current")
      .then((response) => {
        setUser(response.data); // 사용자 정보 설정
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // 강의 데이터 가져오기
    axios
      .get(`/api/lecture/${id}`)
      .then((response) => {
        setLectureData(response.data);
        setChatMessages(response.data.chatMessages || []);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // 로그인한 사용자 정보에서 토큰 가져오기
    const token = localStorage.getItem("token");

    // WebSocket 연결 설정
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    stompClient.current.connect({}, (frame) => {
      console.log("Connected: " + frame);

      // /topic/public 경로를 구독 (서버에서 메시지를 브로드캐스트하는 경로)
      stompClient.current.subscribe("/topic/public", (message) => {
        // 메시지를 수신할 때 처리하는 로직
        const chatMessage = JSON.parse(message.body);
        setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
      });
    });
  }, []);

  const sendMessage = () => {
    if (!message.trim()) {
      console.error("Cannot send an empty message");
      return;
    }

    if (stompClient.current && stompClient.current.connected) {
      const chatMessage = {
        content: message,
        senderId: user.id,
        senderName: user.username,
      };

      stompClient.current.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
      setMessage(""); // 메시지 전송 후 입력 필드 비우기
    } else {
      console.error("STOMP client is not connected");
    }
  };

  return (
    <Container>
      <TitleBar>
        <VideoTitle>
          {lectureData ? lectureData.lectureName : "Loading..."}
        </VideoTitle>
      </TitleBar>
      <ContentArea>
        <VideoPlayer>
          {lectureData ? (
            <video
              width="100%"
              height="100%"
              controls
              poster={lectureData.image}
            >
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
              <p key={index}>
                <strong>{msg.senderName}:</strong> {msg.content}
              </p>
            ))
          ) : (
            <p>No chat messages</p>
          )}
          <ChatControls>
            <ChatInput
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="message"
            />
            <ChatButton onClick={sendMessage}>Send</ChatButton>
          </ChatControls>
        </ChatSection>
      </ContentArea>
      <div
        style={{
          position: "absolute",
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          pointerEvents: "none",
          zIndex: 1000,
          fontSize: "24px",
        }}
      >
        👀
      </div>
    </Container>
  );
}
