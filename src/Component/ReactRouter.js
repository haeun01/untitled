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

export function ReactRouter() {
  return <>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Intro/>}></Route>
        <Route path='/intro' element={<Intro/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
         <Route path='/signup' element={<SignUp/>}></Route>
        {/*<Route path='/logout' element={<Logout/>}></Route> */}
        <Route path='/mypage' element={<MyPage/>}>
          <Route path='edit' element={<MyPageEdit/>}></Route>
          <Route path='profile' element={<ProfileEdit/>}></Route>
          <Route path='scrap' element={<FeedList/>}></Route>
          <Route path='like' element={<FeedList/>}></Route>
          <Route path='create' element={<FeedCreate/>}></Route>
        </Route>
        <Route path='/feed' element={<Wrapper/>}>
          <Route path=":id" element={<Feed/>}></Route>
          <Route path="user/:id" element={<FeedUser/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
}