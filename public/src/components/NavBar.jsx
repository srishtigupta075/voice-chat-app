import React, { useEffect, useState, useRef } from "react";
import Logo from "../assets/sasLogo.png";
import styled from "styled-components";
import Logout from "./Logout";

export default function NavBar() {
  return (
    <>
      <Container>
        <div className="brand">
          <div className="leftBar">
            <img src={Logo} alt="logo" />
            <h3>SAS Teams</h3>
          </div>

          <Logout />
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  overflow: hidden;
  background-color: hsl(205, 97%, 41%);
  .brand {
    width: 100vw;
    display: flex;
    gap: 1rem;
    padding: 1rem;
    justify-content: space-between;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    .leftBar {
      display: flex;
      gap: 1rem;
    }
  }
`;
