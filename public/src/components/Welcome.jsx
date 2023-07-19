import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Minions from "../assets/minions.gif";
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
      <img src={Minions} alt="" />
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
  h1, h3 {
    color: black;
  }
  img {
    height: 10rem;
    margin-bottom: 2rem;
  }
  span {
    color:  hsl(205, 97%, 41%);
  }
`;
