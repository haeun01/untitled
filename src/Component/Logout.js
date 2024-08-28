import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { Title } from "./Styles"
import axios from "axios"
import { SessionCurrent } from "./SessionCurrent"

const Container = styled.div`
    background-color: white;
    color: black;
    padding: 100px 0;
    width: 50%;
    margin: auto;
    border-radius: 20px;
`

const Div = styled.div`
    font-size: 35px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 70px;
`

const LoginBtn = styled.div`
    border-radius: 50px;
    background-color: #222;
    color: white;
    width: 50%;
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    font-size: 25px;
    margin: 10px auto;
    cursor: pointer;
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
        <Title>Logout</Title>
        <Container>
            <Div>{sessionUser+"님 로그아웃 하시겠습니까?"}</Div>
            <LoginBtn onClick={()=>{logout()}}>로그아웃</LoginBtn>
            <LoginBtn onClick={()=>{navigate("/")}}>돌아가기</LoginBtn>
        </Container>
    </>
}