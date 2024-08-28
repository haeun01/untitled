import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

// 컨테이너 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: black;
  padding: 40px;
`;

// 검색바 컨테이너 스타일
const SearchContainer = styled.div`
  display: flex;
  align-items: center; 
  width: 500px;
  margin-bottom: 15px;
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
  width: 500px;

`;

// 강의 항목 스타일
const LectureItem = styled.div`
  background-color: #fff;
  color: black;
  padding: 30px;
  padding-left: 20px;
  margin-bottom: 10px;
  border-radius: 15px;
  font-size: 25px;
  cursor: pointer; /* 클릭 가능한 항목으로 설정 */
  transition: transform 0.2s ease, background-color 0.2s ease; /* 부드러운 전환 효과 */
  &:hover {
    background-color: #ccc; /* 호버 시 약간의 색상 변화 */
    transform: scale(1.05); /* 호버 시 약간 확대 */
  }
`;

const LectureTitle = styled.span`
  font-weight: bold;
  font-weight: 500;

`

const InfoText = styled.div`
  font-size: 18px;
  color: black;
  margin-top: 5px;
`

export function LectureSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [lectures, setLectures] = useState([{ id: 1, title: "Lecture 1", info: "Intro to Programming" }]);

  const fetchLectures = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/lectures");
      setLectures(response.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [])

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  // 강의 상세 페이지 이동
  const handleLectureClick = (id) => {
    navigate(`/lecture/${id}`);
  }
  

  return (
    <>
      <Container>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="LECTURE SEARCH"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton onClick={handleSearch}>🔗</SearchButton>
        </SearchContainer>
        <LectureList>
          {lectures.map((lecture) => (
            <LectureItem key={lecture.id} onClick={() => handleLectureClick(lecture.id)}>
              <LectureTitle>{lecture.title}</LectureTitle>
              <InfoText>{lecture.info}</InfoText>
            </LectureItem>
          ))}
        </LectureList>
      </Container>
    </>
  );
}