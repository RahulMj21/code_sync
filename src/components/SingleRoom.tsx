import React, { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "./Logo";
import User from "./User";
import Editor from "./Editor";
import socketInit from "../socketInit";

export interface Client {
  socketId: string;
  username: string;
}

const SingleRoom = () => {
  const socket = useRef<any>();
  const codeRef = useRef<string | null>(null);
  const [allClients, setAllClients] = useState<Client[]>([]);

  const params = useParams();
  const location = useLocation();
  const state = location.state as { username: string };

  const navigate = useNavigate();

  const handleLeave = () => {
    if (socket.current) socket.current.emit("leave");
    navigate("/");
    toast.success("you left the room");
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(params.id as string);
    toast.success("Copied RoomId");
  };
  const handleErrors = (err: any) => {
    toast.error("connection falied");
    console.log(err);
    return navigate("/");
  };

  useEffect(() => {
    socket.current = socketInit();

    socket.current?.on("connect_error", (err: any) => handleErrors(err));
    socket.current?.on("connect_failed", (err: any) => handleErrors(err));

    socket.current?.emit("join", {
      roomId: params.id,
      username: state.username,
    });

    // listining for joined
    socket.current?.on(
      "joined",
      ({
        socketId,
        username,
        clients,
      }: {
        socketId: string;
        username: string;
        clients: Client[];
      }) => {
        setAllClients(clients);

        if (state.username !== username) {
          toast.success(`${username} joined`);
        }

        if (codeRef.current !== null)
          socket.current?.emit("code_sync", {
            socketId,
            code: codeRef.current,
          });
      }
    );

    // listining for disconnect
    socket.current?.on("disconnected", ({ socketId, username }: Client) => {
      if (state.username !== username) {
        toast.success(`${username} left`);
      }

      setAllClients((prev) =>
        prev.filter((client) => client.socketId !== socketId)
      );
    });
  }, []);

  if (!state.username) {
    toast.error("connection failed");
    return <Navigate to="/" />;
  }

  return (
    <section className="singleRoom">
      <aside className=" singleRoom__sidebar">
        <div className="container">
          <div className="inner-container">
            <Logo small={true} />
            <div className="singleRoom__users">
              {allClients.map((client) => (
                <User name={client.username} key={client.socketId} />
              ))}
            </div>
          </div>
          <div className="singleRoom__buttons">
            <button onClick={handleCopyRoomId} className="btn-brand copy-btn">
              Copy Room Id
            </button>
            <button onClick={handleLeave} className="btn-brand leave-btn">
              Leave Room
            </button>
          </div>
        </div>
      </aside>
      <main className="singleRoom__workspace">
        <Editor
          onCodeChange={(code: string) => (codeRef.current = code)}
          socket={socket}
          roomId={params.id}
        />
      </main>
    </section>
  );
};

export default SingleRoom;
