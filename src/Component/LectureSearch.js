import React, { useState } from "react";
import styled from "styled-components";

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
  padding: 20px;
  padding-left: 40px;
  margin-bottom: 15px;
  border-radius: 15px; 
  font-size: 25px;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [lectures, setLectures] = useState(["Lecture 1", "Lecture 2", "Lecture 3", "Lecture 4"]);

  const handleSearch = () => {
    // 검색 로직 추가
    alert(`Searching for: ${searchQuery}`);
  };

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
          {lectures.map((lecture, index) => (
            <LectureItem key={index}>
              <LectureTitle>{lecture}</LectureTitle>
              <InfoText>info</InfoText>
            </LectureItem>
          ))}
        </LectureList>
      </Container>
    </>
  );
}