import React, { useState } from "react";
import { FaKey, FaLock } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import toast from "react-hot-toast";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const handleCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomId || !username) return;
    navigate(`/room/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("successfully joined");
  };

  return (
    <section className="createRoom">
      <div className="container">
        <main className="createRoom__main">
          <Logo small={false} />
          <form
            className="createRoom__form"
            autoComplete="off"
            onSubmit={(e) => handleCreateRoom(e)}
          >
            <p className="todo">paste invitation / Room id {"&"} password</p>
            <div className="input-group">
              <FaKey />
              <input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                type="text"
                required
              />
              <label htmlFor="roomid">Room Id</label>
            </div>
            <div className="input-group">
              <FaLock />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                required
                name="username"
                autoComplete="off"
              />
              <label htmlFor="username">Username</label>
            </div>
            <button className="btn-brand">Join</button>
            <p className="create-room">
              If you don't have an invite then create{" "}
              <button type="button" onClick={() => setRoomId(uuid())}>
                New Room
              </button>
            </p>
          </form>
        </main>
      </div>
    </section>
  );
};

export default CreateRoom;
