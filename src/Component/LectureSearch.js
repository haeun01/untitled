import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 컨테이너 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: black;
  padding: 0;
  box-sizing: border-box;
  cursor: none;
`;

// 검색바 컨테이너 스타일
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
  margin-bottom: 40px;
`;

// 검색 입력 스타일
const SearchInput = styled.input`
  flex: 1;
  height: 30px;
  border: 1px solid white;
  background-color: black;
  color: white;
  outline: none;
  font-size: 16px;
  margin-right: 10px;
  padding-left: 10px;
`;

// 검색 버튼 스타일
const SearchButton = styled.button`
  width: 70px;
  height: 30px;
  border: 1px solid white;
  background-color: white;
  color: black;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

// 좌우 스크롤 버튼 스타일
const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const LeftButton = styled(ScrollButton)`
  left: 300px;
`;

const RightButton = styled(ScrollButton)`
  right: 300px;
`;

// 강의 리스트 스타일
const LectureList = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  overflow-x: hidden;
  padding: 20px 0;
  gap: 20px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &::-webkit-scrollbar {
    height: 6px;
    border-radius: 50px;
    // border: 1px solid #fff;
  }

  &::-webkit-scrollbar-thumb {
    background: #561689;
    border-radius: 10px;
    // border: 1px solid #fff;
  }
`;

// 강의 항목 스타일
const LectureItem = styled.div`
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => props.imageUrl});
  color: black;
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
  width: 400px;
  height: 600px;
  box-sizing: border-box;
  transition: transform 0.2s ease, background-color 0.2s ease;
  scroll-snap-align: center;
  flex-shrink: 0;
  margin-right: 20px;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    z-index: 1;
  }

  &:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }
`;

const LectureTitle = styled.span`
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
  color: white;
  text-shadow: 0px 3px 3px rgba(255, 255, 255, 0.5);
`;

const InfoText = styled.div`
  font-size: 16px;
  color: white;
  margin-top: 10px;
  position: relative;
  z-index: 1;
  transform: translateX(-100%);
  transition: transform 0.5s ease, opacity 0.5s ease;
  opacity: 0;

  ${LectureItem}:hover & {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Logo = styled.div`
  width: 100px;
  height: 100px;
  margin: 50px 0;
`;

export function LectureSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [lectures, setLectures] = useState([]);
  const searchRef = useRef(null);
  const lectureListRef = useRef(null);
  const scrollAnimationRef = useRef(null);

  // 이모티콘의 위치를 상태로 관리
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

  // 강의 목록 불러오는 함수
  const fetchLectures = async () => {
    try {
      const response = await axios.get("/api/findAllLecture");
      setLectures(response.data);
    } catch (error) {
      console.error("강의 목록 불러오기 오류: ", error);
    }
  };

  // 검색 핸들러
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      alert("검색어를 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/searchLecture",
        {
          params: { query: searchQuery },
        }
      );

      if (response.data.length > 0) {
        setLectures(response.data);
      } else {
        alert("검색 결과가 없습니다.");
        fetchLectures(); // 기본 강의 목록 불러오기
      }
    } catch (error) {
      console.error("검색 중 오류 발생: ", error);
      alert("검색 중 오류가 발생했습니다.");
      fetchLectures();
    }
  };

  // 컴포넌트가 처음 렌더링될 때 기본 강의 목록 불러오기
  useEffect(() => {
    fetchLectures();
  }, []);

  // 강의 클릭 시 이동
  const handleLectureClick = (id) => {
    navigate(`/lecture/${id}`);
  };

  // 엔터 키 입력 감지 핸들러
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // 로고 클릭 시 초기화 및 스크롤 이동
  const handleLogoClick = () => {
    fetchLectures(); // 기본 강의 목록 불러오기
    setSearchQuery(""); // 검색어 초기화
    if (searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth" }); // 검색창으로 스크롤 이동
    }
  };

  const scroll = (direction) => {
    if (lectureListRef.current) {
      lectureListRef.current.scrollBy({ left: direction, behavior: "smooth" });
    }
  };

  // 부드럽게 왼쪽으로 스크롤하는 함수
  const startScrollLeft = () => {
    scrollSmoothly(-5); // 왼쪽으로 부드럽게 이동 (값을 조정해서 속도를 제어)
  };

  // 부드럽게 오른쪽으로 스크롤하는 함수
  const startScrollRight = () => {
    scrollSmoothly(5); // 오른쪽으로 부드럽게 이동
  };

  // requestAnimationFrame을 사용해 부드럽게 스크롤
  const scrollSmoothly = (step) => {
    if (lectureListRef.current) {
      lectureListRef.current.scrollBy({ left: step });
      scrollAnimationRef.current = requestAnimationFrame(() =>
        scrollSmoothly(step)
      );
    }
  };

  // 스크롤을 멈추는 함수
  const stopScroll = () => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }
  };

  return (
    <Container>
      <SearchContainer ref={searchRef}>
        <SearchInput
          type="text"
          placeholder="LECTURE SEARCH"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SearchButton onClick={handleSearch}>🔗</SearchButton>
      </SearchContainer>
      <LeftButton
        onMouseDown={startScrollLeft}
        onMouseUp={stopScroll}
        onMouseLeave={stopScroll}
      >
        ◁
      </LeftButton>
      <LectureList ref={lectureListRef}>
        {lectures.map((lecture) => (
          <LectureItem
            key={lecture.id}
            imageUrl={lecture.thumbnail}
            onClick={() => handleLectureClick(lecture.id)}
          >
            <LectureTitle>{lecture.lectureName}</LectureTitle>
            <InfoText>{lecture.description}</InfoText>
          </LectureItem>
        ))}
      </LectureList>
      <RightButton
        onMouseDown={startScrollRight}
        onMouseUp={stopScroll}
        onMouseLeave={stopScroll}
      >
        ▷
      </RightButton>
      <Logo>
        <a href="#" onClick={handleLogoClick}>
          <img
            src="./images/logo/logo_white.png"
            width="100"
            height="100"
            alt="untitled_logo"
          />
        </a>
      </Logo>
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
