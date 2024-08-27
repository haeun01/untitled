import axios from "axios";
import { useEffect, useState } from "react";

export function SessionCurrent() {
    const [sessionUser, setSessionUser] = useState(null);

    useEffect(() => {
        current()
    }, []);
    
    async function current() {
        try {
            const response = await axios.get("http://localhost:8080/api/current", {withCredentials:true});
            const data = response.data;
            const userId = data.userId;
            setSessionUser(userId)
        } catch (error) {
            console.log("요청에 실패했습니다.", error);
            setSessionUser(null)
        }
    }

    return {sessionUser}
}