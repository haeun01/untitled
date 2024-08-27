import styled from "styled-components"
import { Title } from "./Styles"
import { SessionCurrent } from "./SessionCurrent"
import axios from "axios"

const FlexC = styled.div`
    width: 50%;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
`
const Flex = styled.div`
    display: flex;
    justify-content: end;
    margin-top: 20px;
`
const Input = styled.input`
    border: 2px solid white;
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0);
    padding: 15px 50px;
    width: 100%;
    font-size: 25px;
    color: white;
`
const EditBtn = styled.div`
    border-radius: 50px;
    background-color: white;
    padding: 10px 70px;
    font-size: 25px;
    color: black;
    cursor: pointer;

    &:hover {
        transform: scale(1.03);
    }
`


export function MyPageEdit(){
    const { sessionUser } = SessionCurrent();

    let password;
    let name;
    let email;
    let birthday;

    async function EditBtnClick(){
        if(password){
            try{
                const response = await axios.post("http://localhost:8080/api/changePassword", {userId: sessionUser, password: password});
                const data = response.data;
                console.log(password)
            }catch(error){
                console.log("요청에 실패했습니다.", error);
            }
        }
        if(name){
            try{
                const response = await axios.post("http://localhost:8080/api/changeUserName", {userId: sessionUser, userName: name});
                const data = response.data;
                console.log(name)
            }catch(error){
                console.log("요청에 실패했습니다.", error);
            }
        }
        if(email){
            try{
                const response = await axios.post("http://localhost:8080/api/changeUserEmail", {userId: sessionUser, email: email});
                const data = response.data;
                console.log(email)
            }catch(error){
                console.log("요청에 실패했습니다.", error);
            }
        }
        if(birthday){
            try{
                const response = await axios.post("http://localhost:8080/api/changeUserBirthday", {userId: sessionUser, birthday: birthday});
                const data = response.data;
                console.log(birthday)
            }catch(error){
                console.log("요청에 실패했습니다.", error);
            }
        }
        
    }

    return <>
        <FlexC>
            <Title>Edit Info</Title>
            <Input type="text" placeholder="PW" onChange={(e)=> {password = e.target.value}} />
            <Input type="text" placeholder="NAME" onChange={(e)=> {name = e.target.value}} />
            <Input type="text" placeholder="EMAIL" onChange={(e)=> {email = e.target.value}} />
            <Input type="date" onChange={(e)=> {birthday = e.target.value}} />
            <Flex>
                <EditBtn onClick={()=>{EditBtnClick()}}>Edit</EditBtn>
            </Flex>
        </FlexC>
        
    </>
}