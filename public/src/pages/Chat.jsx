import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import NavBar from "../components/NavBar";
import SmartAsistant from "../components/SmartAsistant";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isRecording, setIsRecording] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [modalText, setModalText] = useState("");
  const showModal = useRef(false);
  const isRecordingRef = useRef(false);

  useEffect(async () => {
    const recognition = new window.webkitSpeechRecognition();
    window.recognition = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.start();

    recognition.onresult = (event) => {
      const results = event.results;
      const text = results[results.length - 1][0].transcript;
      if (text.toLowerCase() === "open smart assistant.") {
        setIsOpen(true);
      }
      showModal.current && setModalText(text);
      isRecordingRef.current && setIsRecording(false);
      console.log(text);
    };

    // recognition.onspeechstart = (event) => {
    //   console.log("start", event);
    // };

    recognition.onend = (event) => {
      console.log("end", event);
      // recognition.start();
    };

    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);

  useEffect(() => {
    if (isOpen && modalText) {
      setTimeout(() => {
        setMessage(modalText);
        setIsOpen(false);
        setModalText("");
      }, 1000);
    }
  }, [modalText]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 300);
    }
  }, [message]);

  useEffect(() => {
    showModal.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      setContacts(data.data);
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="navContainer">
          <NavBar message={message} />
        </div>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              socket={socket}
              message={message}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          )}
        </div>
        {isOpen && <SmartAsistant setIsOpen={setIsOpen} message={modalText} />}
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .navContainer {
    height: 10vh;
  }
  .container {
    height: 90vh;
    width: 100vw;
    background-color: #eff4f9;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
