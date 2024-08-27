import { useEffect, useState } from "react";
import { SessionCurrent } from "./SessionCurrent";
import axios from "axios";
import { base64ToBlob, getServerImgFile } from "./File";
import styled from "styled-components";
import defaltUserImg from "./../img/defaltUserImg.png";

const Container = styled.div`
    padding: 0 10%;
`
const Text = styled.div`
    font-size: 20px;
    margin: 30px 0 5px 0;
    font-weight: bold;
`
const NowProfile = styled.div`
    padding: 10px 10px;
    background: linear-gradient(to right, rgba(86, 22, 137, 0.5), rgba(0, 128, 128, 0.5));
    border-radius: 5px;
`
const Flex = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`
const ProfileImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 5px;
`
const ImgUploadBox = styled.div`
    display: flex;
    align-items: end;
    gap: 10px;
`
const ImgBox = styled.div`
    width: 100px;
    height: 100px;
`
const Textarea = styled.textarea`
    width: 100%;
    padding: 5px;
    background-color: black;
    color: white;
    border: 1px solid white;
`
const Button = styled.div`
    background-color: white;
    color: black;
    padding: 10px 0;
    text-align: center;
    /* width: 100px; */
    margin: auto;
    cursor: pointer;
`



export function ProfileEdit(){
    // 선택된 파일의 URL을 저장하는 state
    const [imageSrc, setImageSrc] = useState(null);
    const [imageByte, setImageByte] = useState(null);
    const [imageSendFile, setImageSendFile] = useState(null);
    const [user, setUser] = useState(null);
    const [change, setChange] = useState(false);
    const { sessionUser } = SessionCurrent();

    function showFile(file) {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageSrc(imageUrl);
        }
    }

    function convertImageToBytes(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const arrayBuffer = reader.result;
                const byteArray = new Uint8Array(arrayBuffer);
                setImageByte(byteArray);
                convertBytesToFile(byteArray);
            };

            reader.onerror = () => {
                console.error("파일 읽기에 실패했습니다.");
            };

            reader.readAsArrayBuffer(file);
        }
    }

    function convertBytesToFile(byteArray) {
        const blob = new Blob([byteArray]);
        const file = new File([blob], 'default_filename.bin');
        showFile(file);
        setImageSendFile(file);
    }

    async function editBtnClick() {
        if(imageSendFile!=null){
            const formData = new FormData();
            formData.append("file", imageSendFile);
            formData.append("user", sessionUser);
            try {
                const response = await axios.post("http://localhost:8080/api/upload/user", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log("img",response.data);
                setChange(!change)
            } catch (error) {
                console.error("요청에 실패했습니다.", error.response ? error.response.data : error.message);
            }
        }
        if(profileText){
            try {
                const response = await axios.post("http://localhost:8080/api/changeProfileText", {userId: sessionUser, profileText: profileText});
                console.log("text",response.data);
                setChange(!change)
            } catch (error) {
                console.error("요청에 실패했습니다.", error.response ? error.response.data : error.message);
            }
        }
    }

    let profileText;

    useEffect(() => {
        if(sessionUser){
            SendUser()
        }
        setImageSrc(null);
        setImageByte(null);
        setImageSendFile(null);
    }, [sessionUser, change]);

    async function SendUser(){
        try{
            const response = await axios.post("http://localhost:8080/api/sendUser", {userId: sessionUser});
            const data = response.data;
            setUser(data)
            console.log(data)
        }catch(error){
            console.log("요청에 실패했습니다.", error);
        }
    }

    return <>
        <Container>
            <div style={{fontSize:"50px", fontWeight:"bold", textAlign:"center", margin:"20px 0"}}>프로필 수정</div>
            
            {user? <NowProfile>
                <Text style={{margin:"0 0 10px 0"}}>현재 프로필</Text>
                <Flex>
                    <ProfileImg src={user.data? getServerImgFile(user.data): defaltUserImg} />
                    <div>{user.profileText}</div>
                </Flex>
            </NowProfile>: <div></div>}

            <Text>프로필 이미지 수정</Text>
            <ImgUploadBox>
                {imageSrc && <ImgBox><img src={imageSrc} alt="Selected Image" style={{ maxWidth: '100%', height: 'auto' }} /></ImgBox>}
                <input type="file" id="fileInput" accept="image/*" onChange={(e)=>{convertImageToBytes(e)}} required /><br/>
            </ImgUploadBox>
            <Text>프로필글 수정</Text>
            <Textarea 
                id="profileText" 
                name="profileText" 
                rows="10"
                placeholder="Enter Profile Text" 
                required
                onChange={(e)=> {profileText = e.target.value}}
            />
            <Button onClick={()=>{editBtnClick()}}>Edit</Button>            
        </Container>
    </>
}

