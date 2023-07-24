import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { stringAvatar } from "../utils/ImageUtil";
import Avatar from "@mui/material/Avatar";

const useOutsideClick = (callback) => {
  const ref = React.useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref]);
  return ref;
};

export default function ChatContainer({
  currentChat,
  socket,
  message,
  isRecording,
  setIsRecording,
}) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userTranslateMap, setUserTranslateMap] = useState({});
  const [dropdown, setDropDown] = useState(false);

  const handleClickOutside = () => {
    setDropDown(false);
  };
  const ref = useOutsideClick(handleClickOutside);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTranslate = () => {
    setUserTranslateMap({
      ...userTranslateMap,
      [currentChat._id]: !userTranslateMap[currentChat._id],
    });
  };

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <Avatar {...stringAvatar(`${currentChat.username}`)} />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
          <div
            ref={ref}
            className="dropdown"
            onClick={() => setDropDown(!dropdown)}
          >
            <BsThreeDotsVertical />
            {dropdown && (
              <ul className="menu">
                <li className="menu-item" onClick={() => handleTranslate()}>
                  <div>
                    {userTranslateMap[currentChat._id] && <TiTick />} Translate
                    to English
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput
        handleSendMsg={handleSendMsg}
        translate={userTranslateMap[currentChat._id]}
        message={message}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  background-color: #ebdfdf73;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      width: 100%;
      align-items: center;
      gap: 1rem;
      margin-top: 0.5rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: black;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: white;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: hsl(205, 97%, 41%);
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: hsl(205, 97%, 41%);
      }
    }
  }
  .dropdown {
    position: relative;
    margin-left: auto;
  }

  .menu {
    position: absolute;
    list-style-type: none;
    padding: 10px;
    right: 0;
    border: 1px solid grey;
    border-radius: 5px;
    width: 200px;
    height: 35px;
    background-color: white;

    .menu-item {
      cursor: pointer;
      align-items: center;
      justify-content: center;
      display: flex;
    }
  }

  .menu-item > div {
    display: flex;
    gap: 0.5rem;
  }
`;
