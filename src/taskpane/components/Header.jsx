import * as React from "react";
import PropTypes from "prop-types";
import { Image, tokens, makeStyles, Button } from "@fluentui/react-components";

const useStyles = makeStyles({
  welcome__header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: tokens.colorNeutralBackground3,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 48,
    padding: "0 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  logoTitle: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  message: {
    fontSize: "20px",
    fontWeight: tokens.fontWeightRegular,
    fontColor: tokens.colorNeutralBackgroundStatic,
  },
});

const Header = (props) => {
  const { title, logo, onBackHome, rightContent, className } = props;
  const styles = useStyles();

  return (
    <section className={className ? className : styles.welcome__header}>
      <div className={styles.logoTitle}>
        <Image
          src={logo}
          style={{
            height: 40,
            width: "auto",
            maxHeight: 40,
            objectFit: "contain",
          }}
        />
        <span style={{ fontWeight: 600, fontSize: 18 }}>{title}</span>
      </div>
      {rightContent ? (
        <div>{rightContent}</div>
      ) : onBackHome ? (
        <Button
          appearance="secondary"
          style={{
            background: "#fff",
            color: "#981b1d",
            border: "2px solid #981b1d",
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 20,
            minWidth: 120,
            boxShadow: "none",
          }}
          onClick={onBackHome}
        >
          Back to Home
        </Button>
      ) : null}
    </section>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  onBackHome: PropTypes.func,
  rightContent: PropTypes.node,
  className: PropTypes.string,
};

export default Header;
