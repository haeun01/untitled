import { useEffect, useState } from "react"
import styled from "styled-components"
import { SessionCurrent } from "./SessionCurrent"
import axios from "axios"
import { getServerImgFile } from "./File"
import { useNavigate } from "react-router-dom"


const Container = styled.div`
    padding: 0 10%;
`
const ImgBox = styled.div`
    width: 100%;
    height: 400px;
    border: 1px solid white;
    display: flex;
    justify-content: center;
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
    &:hover {
        background-color: #561689;
        color: white;
    }
`

export function FeedEdit({feed}){
    console.log(3, feed)
    const [imageSrc, setImageSrc] = useState(null);
    const [imageByte, setImageByte] = useState(null);
    const [imageSendFile, setImageSendFile] = useState(null);
    const [text, setText] = useState(feed.text);

    useEffect(() => {
        console.log(4, feed)
        if(feed.imageData){
            setImageSrc(getServerImgFile(feed.imageData));
        }else{
            setImageSrc(feed.image)
        }
    }, [feed]);

    

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
        const formData = new FormData();
        if(imageSendFile!=null){
            formData.append("file", imageSendFile);
        }
        formData.append("id", feed.id);
        formData.append("text", text);
        console.log(1, formData)
        try {
            const response = await axios.post("http://localhost:8080/api/updateFeed", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("img",response.data);
        } catch (error) {
            console.error("요청에 실패했습니다.", error.response ? error.response.data : error.message);
        }
        window.location.href = '/feed/' + feed.id;
    }


    return <>
        <Container>
            <div style={{fontSize:"50px", fontWeight:"bold", textAlign:"center", margin:"20px 0"}}>피드 수정</div>
            <input type="file" id="fileInput" accept="image/*" onChange={(e)=>{convertImageToBytes(e)}} required /><br/>
            <ImgBox>{imageSrc && <img src={imageSrc} alt="Selected Image" style={{ maxHeight: '100%'}} />}</ImgBox>
            <Textarea 
                id="text" 
                name="text" 
                rows="5"
                required
                value={text}
                placeholder="Enter Profile Text"
                onChange={(e)=> {setText(e.target.value)}}
            />
            <Button onClick={()=>{editBtnClick()}}>Edit</Button>
        </Container>
    </>
}