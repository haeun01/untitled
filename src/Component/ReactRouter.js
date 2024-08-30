import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Navbar } from "./Navbar";
import { Intro } from "./Intro";
import { MyPage } from "./MyPage";
import { MyPageEdit } from "./MyPageEdit";
import { FeedList } from "./FeedList";
import { Wrapper } from "./Wrapper";
import { Feed } from "./Feed";
import { FeedUser } from "./FeedUser";
import { SignUp } from "./SignUp";
import { ProfileEdit } from "./ProfileEdit";
import { FeedCreate } from "./FeedCreate";
import { LectureSearch } from "./LectureSearch";
import { LectureDetail } from "./LectureDetail";
import { Logout } from "./Logout";
import { FeedHome } from "./FeedHome";

export function ReactRouter() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/mypage" element={<MyPage />}>
            <Route path="edit" element={<MyPageEdit />} />
            <Route path="profile" element={<ProfileEdit />} />
            <Route path="scrap" element={<FeedList />} />
            <Route path="like" element={<FeedList />} />
            <Route path="create" element={<FeedCreate />} />
          </Route>
          <Route path="/feed" element={<Wrapper />}>
            <Route path=":id" element={<Feed />} />
            <Route path="user/:id" element={<FeedUser />} />
            <Route path="home" element={<FeedHome />} />
          </Route>
          {/* 중첩된 경로를 피하고 LectureDetail을 같은 레벨로 설정 */}
          <Route path="/lecturesearch" element={<LectureSearch />} />
          <Route path="/lecture/:id" element={<LectureDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
