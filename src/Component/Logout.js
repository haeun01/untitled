import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import axios from "axios"
import { SessionCurrent } from "./SessionCurrent"

// 얇은 텍스트 스타일
const Title = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 100;
    font-size: 80px;
    color: white;
    margin-bottom: 40px;
`;

const Container = styled.div`
    color: black;
    padding: 100px 0;
    width: 50%;
    margin: auto;
    display: columns;
    justify-content: center;
    align-items: center;
`

const Div = styled.div`
    font-size: 25px;
    color: white;
    text-align: center;
    font-weight: bold;
    margin-bottom: 70px;
    font-weight: 100;

`

// const LoginBtn = styled.div`
//     border-radius: 50px;
//     background-color: white;
//     color: black;
//     width: 50%;
//     padding-top: 20px;
//     padding-bottom: 20px;
//     text-align: center;
//     font-size: 25px;
//     margin: 10px auto;
//     cursor: pointer;
// `

const Button = styled.button`
  width: 40%;
  padding: 10px;
  margin: 10px 10px;
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

const BtnContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
`

export function Logout(){
    const { sessionUser } = SessionCurrent();
    const navigate = useNavigate();

    async function logout(){
        try{
            const response = await axios.post("http://localhost:8080/api/user/logout", {}, { withCredentials: true });
            const data = response.data;
            console.log(data);
            alert("로그아웃 되었습니다.");
            window.location.href = '/login';
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    return <>
    <Container>
        <Title>Logout</Title>
            <Div><strong>{sessionUser}</strong>님 로그아웃 하시겠습니까?</Div>
            <BtnContainer>
            <Button onClick={()=>{logout()}}>Logout</Button>
            <Button onClick={()=>{navigate("/")}}>Back</Button>
            </BtnContainer>
        </Container>
    </>
}