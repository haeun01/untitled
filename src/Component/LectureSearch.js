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

// 강의 리스트 스타일
const LectureList = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  overflow-x: auto;
  padding: 20px 0;
  gap: 20px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &::-webkit-scrollbar {
    height: 8px;
    border-radius: 10px;
    border: 1px solid #fff;
  }

  &::-webkit-scrollbar-thumb {
    background: #561689;
    border-radius: 10px;
    border: 1px solid #fff;
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
    transform: scale(1.05); /* 살짝 확대 */
    z-index: 1;
  }

  &:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 배경 어두워짐 */
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
  color: white; /* 텍스트가 배경 위에 잘 보이도록 흰색으로 설정 */
`;

const InfoText = styled.div`
  font-size: 16px;
  color: white;
  margin-top: 10px;
  position: relative;
  z-index: 1;
  transform: translateX(-100%); /* 처음엔 화면 밖에 위치 */
  transition: transform 0.5s ease, opacity 0.5s ease; /* 슬라이드 애니메이션 */
  opacity: 0; /* 처음엔 보이지 않도록 설정 */

  ${LectureItem}:hover & {
    transform: translateX(0); /* 마우스 오버 시 왼쪽에서 오른쪽으로 슬라이드 */
    opacity: 1; /* 마우스 오버 시 텍스트 보이도록 설정 */
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
      <LectureList>
        {lectures.map((lecture) => (
          <LectureItem
            key={lecture.id}
            imageUrl={lecture.imageUrl} /* 데이터베이스에서 가져온 이미지 URL */
            onClick={() => handleLectureClick(lecture.id)}
          >
            <LectureTitle>{lecture.lectureName}</LectureTitle>
            <InfoText>{lecture.description}</InfoText>
          </LectureItem>
        ))}
      </LectureList>
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
    </Container>
  );
}
