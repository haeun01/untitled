import logo from "./logo.svg";
import "./App.css";
import { Intro } from "./Component/Intro";
import { Login } from "./Component/Login";
import { ReactRouter } from "./Component/ReactRouter";
import styled from "styled-components";

const All = styled.div`
  background-color: black;
  color: white;
  height: 100vh;
`

const All2 = styled.div`
  background-color: black;
  color: white;
  cursor: default;
`

function App() {
  return (
    <>
      <All>
        <All2>
          <ReactRouter />
        </All2>
      </All>
    </>
  );
}

export default App;
