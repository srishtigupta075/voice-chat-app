import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import StartAudio from "../assets/audio1.png";
import StopAudio from "../assets/audio4.png";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { startRecording, stopRecording } from "../utils/Recorder";
import axios from "axios";
import { getTranslation } from "../utils/APIRoutes";

export default function ChatInput({
  handleSendMsg,
  translateLang = "None",
  message,
  currentChat,
}) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (message && message.toLowerCase().includes("record")) {
      start();
    } else if (message && message.toLowerCase().includes("send")) {
      if (msg && !isRecording) {
        handleSendMsg(msg);
        setMsg("");
      }
    }
  }, [message]);

  useEffect(() => {
    setMsg("");
  }, [currentChat]);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const start = () => {
    setIsRecording(true);
    startRecording();
  };

  const stop = async () => {
    setIsRecording(false);
    const formData = await stopRecording();
    formData.append("language", translateLang);
    const res = await axios.post(
      process.env.REACT_APP_SERVER_BASE_URL + getTranslation,
      formData,
      {
        headers: { "Content-type": `multipart/form-data` },
      }
    );
    let message = res.data.msg;
    if (message.startsWith('"')) {
      message = message.substring(1, message.length - 1);
    }
    setMsg(msg + " " + message);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <div
        className="recorder"
        onClick={() => {
          !isRecording ? start() : stop();
        }}
      >
        <img src={!isRecording ? StartAudio : StopAudio} />
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder={isRecording ? "Listening" : "type your message here"}
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 5% 90%;
  gap: 0.5rem;
  background-color: hsl(205, 97%, 41%);
  padding: 0 2rem;
  @media screen and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
    grid-template-columns: 5% 5% 85%;
  }
  .recorder {
    width: 24px;
    cursor: pointer;
    img {
      height: 24px;
      width: 100%;
    }
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      gap: 1rem;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(197, 194, 194, 0.45);
      border: none;
      @media screen and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
