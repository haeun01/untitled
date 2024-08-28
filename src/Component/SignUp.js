import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";


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
  width: 45%;
  padding: 10px;
  margin: 20px 0;
  border: 1px solid white;
  border-radius: 30px;
  background-color: white;
  color: black;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s; /* 부드러운 전환 효과 추가 */

  &:hover {
    background-color: #561689;
    color: white;
    border: none;
  }
`;

// 버튼 컨테이너 스타일
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export function SignUp() {
  const [user, setUser] = useState(null);

  let id;
  let password;
  let name;
  let email;
  let birthday;

  async function signup(){
    if(id==null || password==null || name==null || email==null || birthday==null){
      alert("빈칸이 있습니다.");
      return;
    }
    const user = {
      userId: id,
      password: password,
      userName: name,
      userEmail: email,
      birthday: birthday
    };
    const sessionUser = {
      userId: id,
      password: password
    }
    try{
      const response = await axios.post("http://localhost:8080/api/signup", user);
      const data = response.data;
      console.log(data);
      alert(data);
      if(data == "이미 등록된 아이디입니다."){
          return;
      } else{
          setUser(sessionUser);
      }
      window.location.href = '/login';
    }catch(error){
      console.log("요청에 실패했습니다.", error);
    }
  }

  return (
    <>
      <Container>
        <Title>Sign Up</Title>
        <FormContainer>
          <Input type="text" placeholder="ID" onChange={(e)=> {id = e.target.value}}/>
          <Input type="password" placeholder="PW" onChange={(e)=> {password = e.target.value}}/>
          <Input type="text" placeholder="NAME" onChange={(e)=> {name = e.target.value}}/>
          <Input type="email" placeholder="EMAIL" onChange={(e)=> {email = e.target.value}}/>
          <Input type="date" placeholder="BIRTHDAY" onChange={(e)=> {birthday = e.target.value}}/>
          <ButtonContainer>
            <Button onClick={()=>{signup()}}>Sign Up</Button>
          </ButtonContainer>
        </FormContainer>
      </Container>
    </>
  );
}
