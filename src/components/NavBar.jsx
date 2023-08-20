import React from "react";
import Logo from "../assets/logo1.png";
import styled from "styled-components";
import Logout from "./Logout";
import { FcAssistant } from "react-icons/fc";

export default function NavBar({ message, startAssistant }) {
  return (
    <>
      <Container>
        <div className="brand">
          <div className="leftBar">
            <img src={Logo} alt="logo" />
            <h2>IntelliChat</h2>
          </div>
          <div className={"rightBar"}>
            <Button className="assistant" onClick={startAssistant}>
              <FcAssistant />
            </Button>
            <Logout message={message} />
          </div>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  overflow: hidden;
  background-color: hsl(205, 97%, 41%);
  height: 100%;
  .brand {
    width: 100vw;
    display: flex;
    gap: 1rem;
    padding: 1rem;
    img {
      height: 2rem;
      border-radius: 100%;
    }
    h2 {
      color: white;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    .leftBar {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .rightBar {
      display: flex;
      margin-left: auto;
      .assistant {
        margin-right: 1rem;
      }
    }
  }
`;
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: hsl(205, 97%, 41%);
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
