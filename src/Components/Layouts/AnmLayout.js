/* eslint-disable jsx-a11y/alt-text */
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { useHistory } from "react-router-dom";
import logo192 from "../../Assets/images/logo192.png";
import Footer from "./Footer";

const useStyles = makeStyles((theme) => {
  return {
    toolbar: theme.mixins.toolbar,
    appTitle: {
      cursor: "pointer",
    },
    grow: {
      flexGrow: 1,
    },
    gutterMargin: {
      margin: "5px",
      marginTop: "10px",
    },
    pageContainer: {
      flexGrow: 1,
      minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 80px)`
    },
  };
});

export default function AnmLayout({ children }) {
  const classes = useStyles();
  const history = useHistory();

  const sizeMatch = useMediaQuery("(max-width:600px)");
  const navigateHome = () => {
    history.push("/");
  };
  return (
    <div>
      <AppBar>
        <Toolbar>
          <img
            src={logo192}
            width={45}
            height={45}
            className={clsx(classes.appTitle)}
            onClick={navigateHome}
          />
          <Typography
            variant={"h6"}
            component={"h1"}
            className={clsx(classes.appTitle)}
            onClick={navigateHome}
          >
            {sizeMatch ? "NSRS Mutt" : "Nanjanagud Sri Raghavendra Swamy Mutt"}
          </Typography>
          <div className={classes.grow}></div>
          <Button
            variant={"outlined"}
            color={"secondary"}
            onClick={navigateHome}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* main content */}
      <div>
        <div className={clsx(classes.toolbar, classes.gutterMargin)}></div>
        <div className={classes.pageContainer}>{children}</div>
        <Footer />
      </div>
    </div>
  );
}
