import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import TextInsertion from "./TextInsertion";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { insertMarkdown, clearWordDocument } from "../taskpane";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    paddingTop: 48,
  },
});

const App = (props) => {
  const { title } = props;
  const styles = useStyles();
  const [resetKey, setResetKey] = React.useState(0);
  const [sessionId, setSessionId] = React.useState("");

  const handleBackHome = async () => {
    await clearWordDocument();
    setSessionId("");
    setResetKey(prev => prev + 1);
  };

  const listItems = [
    {
      icon: <Ribbon24Regular />,
      primaryText: "Achieve more with Office integration",
    },
    {
      icon: <LockOpen24Regular />,
      primaryText: "Unlock features and functionality",
    },
    {
      icon: <DesignIdeas24Regular />,
      primaryText: "Create and visualize like a pro",
    },
  ];

  return (
    <div className={styles.root}>
      <Header logo="assets/aeka-ai-logo.png" {...(sessionId ? { onBackHome: handleBackHome } : {})} />
      <TextInsertion 
        insertMarkdown={insertMarkdown} 
        key={resetKey} 
        sessionId={sessionId}
        setSessionId={setSessionId}
      />
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
