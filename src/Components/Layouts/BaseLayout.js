/* eslint-disable jsx-a11y/alt-text */
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import logo192 from "../../Assets/images/logo192.png";
import actions from "../../Context/Actions";
import { UserContext } from "../../Context/UserContext";
import Footer from "./Footer";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import BusinessIcon from '@material-ui/icons/Business';
import RecentActorsIcon from '@material-ui/icons/RecentActors';

const drawerWidth = 240;

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
      minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 85px)`,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    mainContent: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    mainContentShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${drawerWidth}px`,
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginleft: drawerWidth,
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-start",
    },
    icon: {
      color: theme.palette.primary.contrastText,
    },
    iconText: {
      float: "left",
    },
  };
});

export default function BaseLayout({ children }) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const sizeMatch = useMediaQuery("(max-width:600px)");
  const navigateHome = () => {
    history.push("/");
  };

  const logoutUser = () => {
    setLoggedInUser({ type: actions.LOGOUT_USER });
    history.push("/");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography>Hello {loggedInUser.name || "User"}</Typography>
        </div>
        <Divider />
        <List>
          {["Dashboard", "Add Employee", "Add Branch", "Add Designation"].map(
            (text, index) => (
              <ListItemLink  href={`/${text.toLowerCase().replace(" ", "")}`} key={text}>
                <ListItemIcon>
                  {index === 0 ? (
                    <DashboardIcon className={classes.icon} />
                  ) : index === 1 ? (
                    <GroupAddIcon className={classes.icon} />
                  ) : index === 2 ? (
                    <BusinessIcon className={classes.icon} />
                  ) : (
                    <RecentActorsIcon className={classes.icon} />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} className={classes.iconText} />
              </ListItemLink>
            )
          )}
        </List>
      </Drawer>
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
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
          <Button variant={"outlined"} color={"secondary"} onClick={logoutUser}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* main content */}
      <div
        className={clsx(classes.mainContent, {
          [classes.mainContentShift]: open,
        })}
      >
        <div className={clsx(classes.toolbar, classes.gutterMargin)}></div>
        <div className={classes.pageContainer}>{children}</div>
        <Footer />
      </div>
    </div>
  );
}
