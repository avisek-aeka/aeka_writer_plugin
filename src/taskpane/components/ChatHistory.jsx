import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { useEffect, useRef } from "react";

const useStyles = makeStyles({
  chatContainer: {
    background: "white",
    border: "none",
    // padding: "48px 0 80px 0", 
    padding: "48px 12px 80px 0",
    margin: "0 0 8px 0",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    maxHeight: 'none',
    height: '100%',
    boxSizing: 'border-box',
    overflowY: "auto",
    scrollbarWidth: "none",

    "&::-webkit-scrollbar": {
      width: "0px",
    },

    "&.scrolling": {
      scrollbarWidth: "thin",
      scrollbarColor: "#981b1d transparent",
    },

    "&.scrolling::-webkit-scrollbar": {
      width: "6px",
    },
    "&.scrolling::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&.scrolling::-webkit-scrollbar-thumb": {
      backgroundColor: "#981b1d",
      borderRadius: "4px",
    },
    "&.scrolling::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#7a1517",
    },
  },

  messageRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 0,
  },
  human: {
    alignSelf: "flex-end",
    background: "#981b1d",
    color: "white",
    borderRadius: "20px 20px 0 20px",
    padding: "12px 20px",
    maxWidth: "70%",
    fontWeight: 400,
    fontSize: 17,
    margin: "8px 0 0 0",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  ai: {
    alignSelf: "flex-start",
    background: "#cacccc",
    color: "#981b1d",
    borderRadius: "20px 20px 20px 0",
    padding: "12px 20px",
    maxWidth: "70%",
    fontWeight: 500,
    fontSize: 17,
    margin: "8px 0 0 0",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    position: "relative",
  },
  aiThinking: {
    alignSelf: "flex-start",
    background: "#cacccc",
    color: "#981b1d",
    borderRadius: "20px 20px 20px 0",
    padding: "12px 20px",
    maxWidth: "70%",
    fontWeight: 400,
    fontSize: 17,
    margin: "8px 0 0 0",
    fontStyle: "italic",
    opacity: 0.7,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    position: "relative",
  },
});

export default function ChatHistory({ chat }) {
  const styles = useStyles();
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  if (!Array.isArray(chat) || chat.length === 0) return null;
  return (
    <div ref={chatRef} className={styles.chatContainer}>
      {chat.map((msg, idx) => (
        <div key={idx} className={styles.messageRow} style={{ alignItems: msg.who === "human" ? "flex-end" : "flex-start" }}>
          <div className={msg.thinking ? styles.aiThinking : (styles[msg.who] || styles.ai)}>
            {msg.thinking ? (
              <span>
                <span className="dot-flashing" style={{ display: 'inline-block', width: 24 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 6, height: 6, borderRadius: 3, marginRight: 2, background: '#981b1d',
                    animation: 'dotFlashing 1s infinite linear alternate',
                  }}></span>
                  <span style={{
                    display: 'inline-block',
                    width: 6, height: 6, borderRadius: 3, background: '#981b1d', marginRight: 2,
                    animation: 'dotFlashing 1s infinite linear alternate',
                    animationDelay: '0.2s',
                  }}></span>
                  <span style={{
                    display: 'inline-block',
                    width: 6, height: 6, borderRadius: 3, background: '#981b1d',
                    animation: 'dotFlashing 1s infinite linear alternate',
                    animationDelay: '0.4s',
                  }}></span>
                </span>
                <style>{`
                  @keyframes dotFlashing {
                    0% { opacity: 0.2; }
                    50%, 100% { opacity: 1; }
                  }
                `}</style>
              </span>
            ) : msg.content}
          </div>
        </div>
      ))}
    </div>
  );
}
