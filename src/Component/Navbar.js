import React, { useState } from 'react';
import styled from "styled-components";
import { Sidebar } from './Sidebar';
import menuImg from "./../images/icon/menu.png";

const Container = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 5%;
  background-color: black;
  color: white;
`;

const Menubar = styled.div`
  height: 50px;
  width: 50px;
  cursor: pointer;
`;

const Line = styled.span`
  display: block;
  width: 150px; /* 선의 길이 조정 */
  height: 1px; /* 선의 두께 */
  background-color: white; /* 선의 색상 */
  margin-right: 10px; /* 텍스트와 선 사이의 간격 */
`;

const LineContainer = styled.div`
  display: flex;
  align-items: center; /* 텍스트와 선의 수직 정렬을 맞추기 위해 추가 */
`;
export function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Container>
        <LineContainer>
          <Line/>
          <h3>UNTITLED</h3>
        </LineContainer>
        <Menubar onClick={toggleMenu}>
          <img
            src={menuImg}
            width="50"
            height="50"
            alt="menu"
          />
        </Menubar>
      </Container>
      <Sidebar isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </>
  );
}