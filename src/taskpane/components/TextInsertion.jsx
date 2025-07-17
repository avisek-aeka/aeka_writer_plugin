import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { Button, Input, makeStyles } from "@fluentui/react-components";
import PropTypes from "prop-types";
import { sendInstruction } from "../../api/sendInstruction";
import { bindSession } from "../../api/bindSession";
import { createSession } from "../../api/createSession";
import { renameSession } from "../../api/renameSession";
import ChatHistory from "./ChatHistory";
import { clearWordDocument, getOfficeAccessToken } from "../taskpane";
import { Send24Regular } from "@fluentui/react-icons";
import Header from "./Header";
import aekaLogo from "../../../assets/aeka-ai-logo.png";
import { getUserInfo } from "../../api/getUserInfo";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "900px",
    margin: "40px auto 0 auto",
    padding: "0 0 5px 0",
    minHeight: "80vh",
    position: "relative",
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
    marginTop: 0,
    paddingTop: 48,
    height: "calc(100vh - 40px)",
    boxSizing: "border-box",
    minHeight: 0,
  },
  headerFixed: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "#fff",
    borderRadius: "24px 24px 0 0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    minHeight: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },
  input: {
    flex: 1,
    minHeight: "40px",
    fontSize: "16px",
    border: "2px solid #981b1d",
    borderRadius: "20px",
    background: "#fafbfc",
    padding: "10px 18px",
    boxShadow: "none",
    height: 48,
    ":focus": {
      border: "2px solid #981b1d !important",
      boxShadow: "none !important",
    },
    ":focus-within": {
      border: "2px solid #981b1d !important",
      boxShadow: "none !important",
    },
  },
  button: {
    height: "40px",
    minWidth: "110px",
    fontWeight: 500,
    borderRadius: 20,
    boxShadow: "none",
  },
  label: {
    fontWeight: 500,
    marginBottom: "2px",
    fontSize: "13px",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 0,
    padding: "16px 24px 0 24px",
  },
  chatWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    margin: "0 0 0 0",
    // padding: "0 32px 72px 32px", 
    padding: "0 16px 32px 32px",
    minHeight: 0,
    width: "100%",
    boxSizing: "border-box",
  },
  chatContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    paddingTop: 0,
    marginTop: 0,
    width: "100%",
    boxSizing: "border-box",
  },
  bottomBar: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    background: "transparent",
    border: "none",
    boxShadow: "none",
    display: "flex",
    justifyContent: "center",
    zIndex: 10,
    padding: "0 0 16px 0",
    pointerEvents: "none",
    minHeight: 0,
    height: "auto",
    width: "100%",
  },
  chatInputArea: {
    display: "flex",
    alignItems: "center",
    background: "#fafafa",
    border: "2px solid #981b1d",
    borderRadius: "24px",
    width: "100%",
    maxWidth: 900,
    height: 56,
    boxSizing: "border-box",
    padding: "0 4px 0 4px",
    pointerEvents: "auto",
    boxShadow: "none",
    margin: "0 8px",
  },
  sendInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 20,
    color: "#222",
    padding: "0 0 0 8px", 
    marginRight: 12,
    height: 52,
    lineHeight: "52px",
    '::placeholder': {
      color: '#c7bdbb',
      opacity: 1,
      fontSize: 20,
    },
  },
  sendButton: {
    background: "#981b1d",
    color: "white",
    fontWeight: 600,
    fontSize: 22,
    borderRadius: 0,
    minWidth: 0,
    minHeight: 0,
    height: "auto",
    marginRight: 10,
    paddingRight: 10,
    boxShadow: "none",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: 0,
    width: "auto",
  },
  urlSection: {
    background: "#fafbfc",
    borderRadius: 20,
    padding: 24,
    margin: "150px 24px 0 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  urlRow: {
    display: "flex",
    width: "100%",
    gap: 12,
    marginTop: 8,
    alignItems: "center",
  },
});

const TextInsertion = (props) => {
  const { insertMarkdown, sessionId, setSessionId } = props;
  const [sessionInput, setSessionInput] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState(null); 
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [hasRenamed, setHasRenamed] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const [authError, setAuthError] = useState("");
  const styles = useStyles();
  const inputRef = useRef(null);
  const [msApiCalled, setMsApiCalled] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchTokenAndUser = async () => {
      setAuthenticating(true);
      setAuthError("");
      try {
        let msApiCalledFlag = false;
        let token = await getOfficeAccessToken();
        msApiCalledFlag = true;
        if (token) {
          try {
            const data = await getUserInfo(token);
            if (data.status === "success") {
              setUserInfo({ name: data.name, email: data.email });
              setAuthenticating(false);
              setAuthError("");
            } else {
              setUserInfo({ name: '', email: '' });
              setAuthError("Authentication failed: " + (data.message || "Unknown error"));
              setAuthenticating(false);
            }
          } catch (e) {
            setUserInfo({ name: '', email: '' });
            setAuthError("Authentication failed: Unable to fetch user info.");
            setAuthenticating(false);
          }
        } else {
          setAuthError("Authentication failed: No token returned.");
          setAuthenticating(false);
        }
        setMsApiCalled(msApiCalledFlag);
      } catch (err) {
        setUserInfo({ name: '', email: '' });
        setMsApiCalled(false);
        setAuthError("Authentication failed: " + (err.message || "Unknown error"));
        setAuthenticating(false);
      }
    };
    fetchTokenAndUser();
  }, []);

  useEffect(() => {
    if (sessionId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sessionId]);

  const extractSessionId = (input) => {
    const match = input.match(/[a-f0-9]{24}$/i);
    return match ? match[0] : "";
  };

  const handleBind = async () => {
    const id = extractSessionId(sessionInput);
    if (!id) return;
    setLoadingAction('bind');
    try {
      await clearWordDocument();
      const data = await bindSession(id);
      setSessionId(id);
      setChat(data?.session_data?.chat || []);
      setSessionName(data?.session_data?.session_name || "");
      const docMarkdown = data?.session_data?.draft?.doc?.content;
      if (docMarkdown) {
        await clearWordDocument();
        await insertMarkdown(docMarkdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSend = async () => {
    if (!message || !sessionId) return;
    setLoadingAction('send');
    setErrorMsg("");
    setChat(prev => [
      ...prev,
      { who: "human", content: message, _time: new Date().toISOString() },
      { who: "ai", content: "...", _time: new Date().toISOString(), thinking: true }
    ]);
    let aiMsg = "";
    let markdown = "";
    try {
      const apiResult = await sendInstruction(message, sessionId);
      if (!hasRenamed && sessionName === "New Session") {
        try {
          const renameResult = await renameSession(sessionId, "");
          if (renameResult && renameResult.status === "success" && renameResult.new_name) {
            setSessionName(renameResult.new_name);
            setHasRenamed(true);
          } else {
            setSessionName("New Session");
            setHasRenamed(true);
          }
        } catch (e) {
          console.error("Rename session error:", e);
          setSessionName("New Session");
          setHasRenamed(true);
        }
      }
      try {
        const parsed = typeof apiResult === "string" ? JSON.parse(apiResult) : apiResult;
        aiMsg = parsed?.draft_data?.chat || "";
        markdown = parsed?.draft_data?.doc || "";
      } catch (e) {
        aiMsg = apiResult;
        markdown = apiResult;
      }
      setChat(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(m => m.thinking);
        if (idx !== -1) updated[idx] = { who: "ai", content: aiMsg, _time: new Date().toISOString() };
        else updated.push({ who: "ai", content: aiMsg, _time: new Date().toISOString() });
        return updated;
      });
      if (markdown) {
        try {
          await clearWordDocument();
          await insertMarkdown(markdown);
        } catch (err) {
          setErrorMsg("Failed to update Word document. Please try again.");
          console.error("Word update error:", err);
        }
      }
    } catch (err) {
      let timeoutMsg = "Failed to send message or receive response. Please try again.";
      if (err?.message && err.message.toLowerCase().includes("timeout")) {
        timeoutMsg = "The request timed out. The server may be busy or slow. Please try again in a moment.";
      }
      setErrorMsg(timeoutMsg);
      console.error(err);
      setChat(prev => {
        const updated = prev.filter(m => !m.thinking);
        if (err?.response?.data) {
          updated.push({ who: "ai", content: String(err.response.data), _time: new Date().toISOString() });
        } else if (err?.message) {
          updated.push({ who: "ai", content: String(err.message), _time: new Date().toISOString() });
        } else {
          updated.push({ who: "ai", content: "[Error: No response from AI]", _time: new Date().toISOString() });
        }
        return updated;
      });
    } finally {
      setMessage("");
      setLoadingAction(null);
    }
  };

  const handleRefresh = async () => {
    setSessionInput("");
    setSessionId("");
    setChat([]);
    setMessage("");
    setLoadingAction(null);
    await clearWordDocument();
  };

  const handleCreateSession = async () => {
    setLoadingAction('create');
    try {
      await clearWordDocument();
      const result = await createSession();
      let newSessionId = "";
      let newSessionName = "";
      if (typeof result === 'object' && result.session) {
        newSessionId = result.session.session_id;
        newSessionName = result.session.session_name;
      } else if (typeof result === 'object' && result.session_id) {
        newSessionId = result.session_id;
        newSessionName = result.session_name || "";
      } else if (typeof result === 'string') {
        newSessionId = result;
        newSessionName = "New Session";
      } else {
        newSessionId = "";
        newSessionName = "";
      }
      setSessionId(newSessionId);
      setChat([]); 
      setSessionName(newSessionName);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  // Loader and error UI for authentication
  if (authenticating) {
    return (
      <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255,255,255,0.7)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <div 
        style={{
          border: '6px solid #eee',
          borderTop: '6px solid #981b1d',
          borderRadius: '50%',
          width: 48,
          height: 48,
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{ marginTop: 24, color: '#981b1d', fontWeight: 600, fontSize: 18 }}>Authenticating...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }
  if (authError) {
    return (
      <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255,255,255,0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <div style={{ color: 'red', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Authentication Error</div>
        <div style={{ color: '#981b1d', fontWeight: 500, fontSize: 16, textAlign: 'center', maxWidth: 400 }}>{authError}</div>
        <div style={{ marginTop: 32, color: '#888', fontSize: 14 }}>You are not authorized to use this add-in.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header
        logo={aekaLogo}
        rightContent={
          userInfo.email ? (
            <div style={{ textAlign: "right", fontSize: 10, color: "#981b1d" }}>
              <span style={{ fontWeight: 600 }}>{userInfo.name}</span><br />
              <span>{userInfo.email}</span>
            </div>
          ) : null
        }
        onBackHome={sessionId ? handleRefresh : undefined}
        showBackButton={!!sessionId}
      />
      <div style={{ height: 35 }} />
      {sessionId && sessionName && (
        <div 
        style={{
          width: '100%',
          background: '#fff',
          borderBottom: '1px solid #eee',
          padding: '10px 0 6px 0',
          fontSize: 18,
          fontWeight: 700,
          color: '#981b1d',
          letterSpacing: 0.5,
          boxShadow: '0 2px 8px rgba(152,27,29,0.04)',
          borderRadius: 0,
          marginBottom: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          justifyContent: 'center',
        }}>
          <div 
          style={{
            width: '100%',
            maxWidth: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}>
            <span 
            style={{
              color: '#981b1d',
              fontWeight: 600,
              fontSize: 15,
              background: 'none',
              border: 'none',
              padding: 0,
              boxShadow: 'none',
              borderRadius: 0,
              display: 'inline-block',
            }}>
              {sessionName}
          </span>
          <button
              onClick={handleRefresh}
              style={{
                background: '#fff',
                color: '#981b1d',
                border: '2px solid #981b1d',
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 18,
                minWidth: 120,
                padding: '6px 18px',
                boxShadow: '0 1px 4px rgba(152,27,29,0.07)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
          >
            Back to Home
          </button>
        </div>
      </div>
      )}
      {errorMsg && (
        <div style={{ color: 'red', textAlign: 'center', margin: 12, fontWeight: 600 }}>{errorMsg}</div>
      )}
      {loadingAction && !sessionId && (
        <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255,255,255,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div 
          style={{
            border: '6px solid #eee',
            borderTop: '6px solid #981b1d',
            borderRadius: '50%',
            width: 48,
            height: 48,
            animation: 'spin 1s linear infinite',
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
        </div>
      )}
      {!sessionId && (
        <div className={styles.urlSection}>
          <div className={styles.label} style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Bind your existing session</div>
          <div style={{ color: '#981b1d', fontSize: 14, marginBottom: 12, textAlign: 'center', fontWeight: 400 }}>
            <b>Instructions:</b> <br />
            1. Go to the session page and copy the URL from your browser's address bar.<br />
            2. Paste the full session URL here (e.g. <span style={{fontFamily:'monospace'}}>https://taxllm.aeka.dev/draft/&lt;session_id&gt;</span>).<br />
            3. Click <b>Bind</b> to load your session and chat history.
          </div>
          <div className={styles.urlRow}>
            <Input
              className={styles.input}
              value={sessionInput}
              onChange={e => setSessionInput(e.target.value)}
              placeholder="Paste session URL..."
              disabled={!!loadingAction}
              onKeyDown={e => {
                if (e.key === "Enter" && extractSessionId(sessionInput)) {
                  handleBind();
                }
              }}
            />
            <Button
              className={styles.button}
              appearance="primary"
              onClick={handleBind}
              disabled={!extractSessionId(sessionInput) || !!loadingAction}
              style={{ background: "#981b1d", color: "white", fontWeight: 600, fontSize: 16, minHeight: 45, borderRadius: 20, marginLeft: 12}}
            >
              {loadingAction === 'bind' ? "Binding..." : "Bind"}
            </Button>
          </div>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
              <b>Or, if you want to start a fresh session</b>
            </div>
            <Button
              className={styles.button}
              appearance="secondary"
              style={{ background: "#fff", color: "#981b1d", border: "2px solid #981b1d", fontWeight: 600, fontSize: 16, borderRadius: 20, minWidth: 160, boxShadow: 'none' }}
              onClick={handleCreateSession}
              disabled={!!loadingAction}
            >
              Create New Session
            </Button>
          </div>
        </div>
      )}
      <div className={styles.chatWrapper}>
        <div className={styles.chatContainer}>
          <ChatHistory chat={chat} />
        </div>
      </div>
      {sessionId && (
        <div className={styles.bottomBar}>
          <div className={styles.chatInputArea}>
            <Input
              className={styles.sendInput}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Chat with Aeka AI"
              ref={inputRef}
              disabled={!!loadingAction}
              onKeyDown={e => { if (e.key === "Enter" && message) handleSend(); }}
            />
            <div style={{ paddingRight: 20 }}>
            <Button
              className={styles.sendButton}
              appearance="primary"
              onClick={handleSend}
              disabled={!message || !!loadingAction}
              style={{ height: 'auto', minHeight: 0, minWidth: 0, width: 'auto', fontSize: 26, padding: 0, borderRadius: 0, background: 'transparent', color: '#981b1d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', border: 'none' }}
            >
              <Send24Regular />
            </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TextInsertion.propTypes = {
  insertMarkdown: PropTypes.func.isRequired,
  sessionId: PropTypes.string.isRequired,
  setSessionId: PropTypes.func.isRequired,
};

export default TextInsertion;
