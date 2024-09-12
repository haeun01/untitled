import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
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
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  height: calc(100% - 60px);
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
  border: none;
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
  bottom: 0;
  left: 0;
  padding: 10px;
  background-color: #333;
  box-sizing: border-box;
`;

export function LectureDetail() {
  const { id } = useParams(); // URL에서 강의 ID 가져오기
  const [lectureData, setLectureData] = useState(null); // 강의 데이터를 저장할 상태
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지를 저장할 상태
  const [message, setMessage] = useState(""); // 입력한 메시지 상태
  const [user, setUser] = useState(null); // 현재 로그인한 사용자 정보
  const stompClient = useRef(null);
  const chatMessagesRef = useRef(null);

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
        console.log("User data fetched:", response.data);
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

    stompClient.current.connect(
      {},
      (frame) => {
        console.log("Connected: " + frame);

        stompClient.current.subscribe(`/topic/lecture/${id}`, (message) => {
          try {
            const chatMessage = JSON.parse(message.body);
            console.log("Received message: ", chatMessage); // 메시지 파싱 확인

            setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
          } catch (error) {
            console.error(
              "Error parsing received message:",
              error,
              message.body
            );
          }
        });
      },
      (error) => {
        console.error("Connection ERROR: " + error);
      }
    );
  }, [id]);

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래 이동
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (!message.trim()) {
      console.error("Cannot send an empty message");
      return;
    }

    if (stompClient.current && stompClient.current.connected) {
      const chatMessage = {
        content: message,
        user: { userId: user.userId },
      };

      stompClient.current.send(
        `/app/chat.sendMessage/${id}`,
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
          <ChatMessages ref={chatMessagesRef}>
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <p key={index}>
                  <strong>{msg.userId}</strong> : {msg.content}
                </p>
              ))
            ) : (
              <p>No chat messages</p>
            )}
          </ChatMessages>

          {/* 사용자 로그인 여부에 따라 메시지 입력 필드 및 버튼 표시 */}
          {user ? (
            <ChatControls>
              <ChatInput
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Write a message"
              />
              <ChatButton onClick={sendMessage}>Send</ChatButton>
            </ChatControls>
          ) : (
            <p>You need to log in to send messages.</p>
          )}
        </ChatSection>
      </ContentArea>

      {/* 마우스 커서 표시 */}
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
