import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/comment/comment";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/theme/dracula.css";

const Editor = ({
  socket,
  roomId,
  onCodeChange,
}: {
  socket: React.MutableRefObject<any>;
  roomId: any;
  onCodeChange: Function;
}) => {
  const editorRef = useRef<any>();

  useEffect(() => {
    const init = () => {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("editorTextArea") as HTMLTextAreaElement,
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseBrackets: true,
          autoCloseTags: true,
          lineNumbers: true,
        }
      );
      editorRef.current.on("change", (instance: any, changes: any) => {
        const origin = changes.origin;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socket.current?.emit("code_change", { roomId, code });
        }
      });
    };
    init();
  }, []);
  useEffect(() => {
    if (socket.current) {
      socket.current.on("code_change", ({ code }: { code: string | null }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
  }, [socket.current]);

  return <textarea id="editorTextArea" />;
};

export default Editor;
