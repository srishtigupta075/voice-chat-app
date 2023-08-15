import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { stringAvatar } from "../utils/ImageUtil";
import { soundex } from "soundex-code";
import axios from "axios";
import { recieveMessageRoute } from "../utils/APIRoutes";

export default function Contacts({
  contacts,
  changeChat,
  message,
  socket,
  currChatMsg,
}) {
  const [currentUserData, setCurrentUserData] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [lastMessage, setLastMessage] = useState({});
  const lastMessageRef = useRef({});

  useEffect(() => {
    (async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserData(data);
    })();
  }, []);

  useEffect(() => {
    if (message) {
      const messageArray = message.toLowerCase().split(" ");
      contacts.forEach((c, i) => {
        messageArray.forEach((msg) => {
          if (soundex(c.username) === soundex(msg)) changeCurrentChat(i, c);
        });
      });
    }
  }, [message]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setLastMessage({ ...lastMessageRef.current, [data.from]: data.msg });
      });
    }
  }, [socket.current]);

  useEffect(() => {
    lastMessageRef.current = lastMessage;
  }, [lastMessage]);

  useEffect(() => {
    setLastMessage({
      ...lastMessageRef.current,
      [contacts[currentSelected]?._id]: currChatMsg,
    });
  }, [currChatMsg]);

  useEffect(() => {
    Promise.all(
      contacts.map(async (contact) => {
        const response = await axios.post(recieveMessageRoute, {
          from: currentUserData._id,
          to: contact?._id,
        });
        const msgs = response.data;
        return { [contact?._id]: msgs[msgs.length - 1]?.message };
      })
    ).then((arr) => {
      const tempLastMsg = {};
      arr.forEach((item, index) => {
        tempLastMsg[contacts[index]._id] = item[contacts[index]._id];
      });
      setLastMessage(tempLastMsg);
    });
  }, [contacts]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      <Container>
        <div className="contacts">
          {contacts.map((contact, index) => {
            return (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <Avatar {...stringAvatar(`${contact.username}`)} />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                  <h5>{lastMessage[contact?._id]}</h5>
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <Avatar {...stringAvatar(`${currentUserData?.username}`)} />
          </div>
          <div className="username">
            <h3>{currentUserData?.username}</h3>
          </div>
        </div>
      </Container>
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 90% 10%;
  overflow: hidden;
  background-color: #c5c2c273;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 85% 15%;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.3rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      min-height: 5rem;
      cursor: pointer;
      width: 100%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        overflow: hidden;
        h3 {
          color: black;
        }
        h5 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 0.3rem;
          font-weight: 600;
        }
      }
    }
    .selected {
      background-color: #f9f9f973;
    }
  }

  .current-user {
    background-color: hsl(205, 97%, 41%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 3rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
    }
  }
`;
