import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import logoImg from "./../images/logo/logo_white.png";
import closeImg from "./../images/icon/close.png";
import loginImg from "./../images/icon/login.png";
import logoutImg from "./../images/icon/logout.png";
import { SessionCurrent } from './SessionCurrent';

// Simple shine animation using background
const shine = keyframes`
  0% {
    background-position: -200%;
  }
  100% {
    background-position: 200%;
  }
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? "0" : "-50%")};
  width: 50%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  transition: right 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-right: 30px;
  padding-bottom: 30px;
  z-index: 3;
`;

const MenuLink = styled(Link)`
  font-size: 6.5em;
  color: white;
  text-decoration: none;
  margin: 0px 0;
  font-weight: bold;
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(90deg, rgba(86,22,137,1), rgba(255,255,255,3), rgba(86,22,137,1));
    background-size: 200%;
    animation: ${shine} 1.5s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  padding-top: 25px;
`;

const LoginIcon = styled(Link)`
  position: absolute;
  top: 20px;
  right: 90px; 
  cursor: pointer;
  padding-top: 25px;
`;

const LogoIcon = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
`;

export function Sidebar({ isOpen, toggleMenu }) {
  const { sessionUser } = SessionCurrent();

  return (
    <MenuContainer isOpen={isOpen}>
      {sessionUser=="anonymousUser"?<LoginIcon to='/login' onClick={toggleMenu}>
        <img
          src={loginImg}
          width="50"
          height="50"
          alt="login"
        />
      </LoginIcon>: null}
      {sessionUser&&sessionUser!="anonymousUser"?<LoginIcon to='/logout' onClick={toggleMenu}>
        <img
          src={logoutImg}
          width="50"
          height="50"
          alt="logout"
        />
      </LoginIcon>: null}

      <CloseButton onClick={toggleMenu}>
        <img
          src={closeImg}
          width="50"
          height="50"
          alt="close"
        />
      </CloseButton>

      <MenuLink to='/intro' onClick={toggleMenu}>INTRO</MenuLink>
      <MenuLink to="/feed/home" onClick={toggleMenu}>FEED</MenuLink>
      <MenuLink to="/lecturesearch" onClick={toggleMenu}>LECTURE</MenuLink>
      <MenuLink to="/mypage" onClick={toggleMenu}>MYPAGE</MenuLink>

      <LogoIcon>
        <img
          src={logoImg}
          width="70"
          height="70"
          alt="bottom icon"
        />
      </LogoIcon>
    </MenuContainer>
  );
}
