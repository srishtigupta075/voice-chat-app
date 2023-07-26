import React from "react";
import styled from "styled-components";
import Mic from "../assets/mic-assist.png";

export default function SmartAsistant({ setIsOpen, message }) {
  return (
    <>
      <Container>
        <div
          className="overlay"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <div className="img-container">
            <img height={60} src={Mic} />
            <div className="text">{message ? message : `Listening...`}</div>
          </div>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  .overlay {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
    cursor: pointer;
  }

  .text {
    font-size: 50px;
    color: white;
    margin-top: 0.5rem;
    margin-left: 1rem;
  }

  .img-container {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
  }
`;
