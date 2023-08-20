import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/WelcomeLogo.png";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  return (
    <Container>
      <img src={Logo} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  background-color: #ebdfdf73;
  h1,
  h3 {
    color: black;
    @media screen and (max-width: 480px) {
      font-size: x-small;
    }
  }
  h1 {
    @media screen and (max-width: 480px) {
      font-size: large;
    }
  }
  img {
    height: 10rem;
  }
  span {
    color: hsl(205, 97%, 41%);
  }
`;
