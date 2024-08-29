import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Navbar } from "./Navbar";

// Container 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: black;
  h3 {
    font-size: 60px;
    color: white;
  }
`;

// 로고 애니메이션 스타일 정의
const Logo = styled.div`
  width: 200px;
  height: 200px;
  animation: rotate_image 10s linear infinite;
  transform-origin: 50% 50%;
  @keyframes rotate_image {
    100% {
      transform: rotate(360deg);
    }
  }
`;

// 얇은 텍스트 스타일 정의
const ThinText = styled.span`
  font-weight: 100; /* 얇은(Thin) 폰트 두께 설정 */
`;

// 사각형 컨테이너 스타일 정의
const Rectangle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 200px 0;
  border-width: 1px;
  border-color: white;
  border-style: solid;
  width: 90%;
  height: 100%;
  position: relative; /* 커서 위치를 컨테이너 안에서만 설정 */
  overflow: hidden;
`;

// 커서 스타일 정의
const Cursor = styled.div`
  opacity: 0;
  position: absolute;
  z-index: 1000;
  transform: translate(-50%, -50%) scale(0.5);
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  transition-property: background, transform;
  transition-duration: 0.4s;

  &.on {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export function Intro() {
  // 타이핑 효과를 위한 상태 정의
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [delta, setDelta] = useState(150); // 타이핑과 삭제의 속도를 동일하게 설정
  const toRotate = ["EVERYONE", "FRIENDS", "BEAUTY", "UNTITLED"]; // 타이핑할 텍스트 배열
  const period = 2000; // 완전한 텍스트가 화면에 유지되는 시간
  const cursorRef = useRef(null); // 커서 요소 참조를 위한 useRef 사용
  const containerRef = useRef(null); // 사각형 컨테이너 참조를 위한 useRef 사용

  // 커서 상태 정의
  const [cursorClass, setCursorClass] = useState("");

  // 타이핑 효과 로직
  useEffect(() => {
    let ticker = setTimeout(() => {
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
      let updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setDelta(period); // 텍스트가 완전히 타이핑되면 대기 시간 설정
        setIsDeleting(true);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setDelta(150); // 새로운 텍스트 타이핑 시작 시의 대기 시간
      } else {
        setDelta(150); // 타이핑 및 삭제 속도 일정하게 유지
      }
    }, delta);

    return () => clearTimeout(ticker);
  }, [text, isDeleting, delta, loopNum]);

  // 마우스 커서 효과 로직
  useEffect(() => {
    const cursor = cursorRef.current;
    const container = containerRef.current;

    if (!cursor || !container) return; // 참조가 유효할 때만 진행

    function cursorEvent(e) {
      cursor.style.top = e.pageY + "px";
      cursor.style.left = e.pageX + "px";
    }

    function handleMouseEnter() {
      setCursorClass("on");
    }

    function handleMouseLeave() {
      setCursorClass("");
    }

    container.addEventListener("mousemove", cursorEvent);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", cursorEvent);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <Container>
        <Rectangle ref={containerRef}>
          <Logo>
            <a href="#">
              <img
                src="./images/logo/logo_white.png"
                width="200"
                height="200"
                alt="untitled_logo"
              />
            </a>
          </Logo>
          <h3>
            <ThinText>"Hello, </ThinText>
            <span>{text}</span>
            <ThinText>"</ThinText>
          </h3>
        </Rectangle>
      </Container>
      <Cursor className={`cursor ${cursorClass}`} ref={cursorRef} />
    </>
  );
}
