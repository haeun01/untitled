import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Sidebar } from './Sidebar';
import menuImg from "./../images/icon/menu.png";

const NavbarFix = styled.div`
  position: ${props => (props.isScrolled ? 'fixed' : 'auto')};
  top: 0;
  width: 100%;
  z-index: 1000;
  height: ${props => (props.isScrolled ? '60px' : '100px')};
  background-color: ${props => (props.isScrolled ? 'rgba(0, 0, 0, 0.7)' : 'black')};
  transition: background-color 0.3s;
`;

const Container = styled.div`
  height: ${props => (props.isScrolled ? '60px' : '100px')};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 5%;
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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) { // 스크롤 위치가 50px 이상일 때
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <NavbarFix isScrolled={isScrolled}>
      <Container isScrolled={isScrolled}>
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
    </NavbarFix>
  );
}