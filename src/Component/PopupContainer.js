import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backBtn from "./../img/BackButton.png"; // 이미지 파일 import
import closeBtn from "./../img/closeButton.png"; // 이미지 파일 import

const Popup = styled.div`
    position: absolute;
    top: 100px; /* 고정된 세로 위치 */
    left: 50%; /* 가로 중앙 */
    transform: translateX(-50%); /* 중앙 정렬을 위해 이동 */
    background: white;
    padding: ${props => props.$padding? props.$padding: "20px"};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 10; /* 팝업이 다른 요소 위에 나타나게 하기 위한 설정 */
    color: black;
    width: 1200px;
`

const Back = styled.div`
    position: absolute; /* 절대 위치로 설정 */
    top: 100px; /* 상단에 붙이기 위해 0으로 설정 */
    left: calc(50% - 620px - 100px); /* Div의 왼쪽에 딱 붙도록 위치 설정 */
    width: 100px;
    height: 100px;
    background-color: white;
    display: flex; /* 중앙 정렬을 위한 flex 설정 */
    flex-direction: column;
    align-items: center; /* 세로 가운데 정렬 */
    justify-content: center; /* 가로 가운데 정렬 */
    padding: 10px;
    cursor: pointer;
`

const CloseBtn = styled.div`
    position: absolute; /* 절대 위치로 설정 */
    top: 100px; /* 상단에 붙이기 위해 0으로 설정 */
    left: calc(50% + 620px); /* Div의 오른쪽에 붙도록 위치 설정 */
    width: 100px;
    height: 100px;
    background-color: white;
    display: flex; /* 중앙 정렬을 위한 flex 설정 */
    flex-direction: column;
    align-items: center; /* 세로 가운데 정렬 */
    justify-content: center; /* 가로 가운데 정렬 */
    padding: 10px;
    cursor: pointer;
`

export function PopupContainer({ padding, back, children, backNavigate}) {
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
    const popupRef = useRef(null); // 팝업 요소를 참조하기 위한 ref

    useEffect(() => {
        const handleClickOutside = (event) => {
            // 클릭된 요소가 팝업 내부가 아닐 경우
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                navigate('/'); // '/' 페이지로 이동
            }
        };

        document.addEventListener("dblclick", handleClickOutside); // mousedown 이벤트 리스너 등록

        return () => {
            document.removeEventListener("dblclick", handleClickOutside); // 언마운트 시 리스너 제거
        };
    }, [navigate]);

    return <>
        {!back? 
            <Back  onClick={() => backNavigate? backNavigate(): navigate(-1)}>
                <img src={backBtn} style={{width:"80%"}}></img>
                <div style={{color: "black"}}>뒤로가기</div>
            </Back> : null
        }
        
        <Popup ref={popupRef} $padding={padding}>
            { children }
        </Popup>
        <CloseBtn onClick={() => navigate('/')}>
            <img src={closeBtn} style={{width:"80%"}}></img>
            <div style={{color: "black"}}>닫기</div>
        </CloseBtn>
    </>
}