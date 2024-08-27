import React from "react";
import styled from "styled-components";
import { Navbar } from "./Navbar";

// 컨테이너 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: black;
  padding-bottom: 200px;
`;

// 얇은 텍스트 스타일
const Title = styled.h1`
  font-weight: 100;
  font-size: 80px;
  color: white;
  margin-bottom: 40px;
`;

// 폼 컨테이너 스타일
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
`;

// 입력 필드 스타일
const Input = styled.input`
  width: 100%;
  padding: 10px;
  padding-left: 30px;
  margin: 10px 0;
  border: 1px solid white;
  border-radius: 30px;
  background-color: black;
  color: white;
  outline: none;
  font-size: 16px;
`;

// 버튼 스타일
const Button = styled.button`
  width: 48%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid white;
  border-radius: 30px;
  background-color: ${props => (props.primary ? "white" : "black")};
  color: ${props => (props.primary ? "black" : "white")};
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s; /* 부드러운 전환 효과 추가 */

  &:hover {
    background-color: ${props => (props.primary ? "#561689" : "black")};
    color: ${props => (props.primary ? "black" : "white")}; 
    border: ${props => (props.primary ? "none" : "1px solid white")}; 
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  // margin-top: 10px;
`;

export function Login() {
  return (
    <>
      <Navbar /> {/* Navbar 컴포넌트 */}
      <Container>
        <Title>Login</Title>
        <FormContainer>
          <Input type="text" placeholder="ID" />
          <Input type="password" placeholder="PW" />
          <ButtonContainer>
            <Button primary>Login</Button>
            <Button>Sign Up</Button>
          </ButtonContainer>
        </FormContainer>
      </Container>
    </>
  );
}
