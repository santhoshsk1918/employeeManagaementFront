import { BottomNavigation, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const styles = makeStyles({
  Footer: {
    backgroundColor: "#CDCDCD",
    bottom: 0,
    width: "100%",
    height: "60px"
  },
  copyright: {
      marginTop: "15px",

  }
});

export default function Footer() {
  const classes = styles();
  return (
    <div>
      <BottomNavigation className={classes.Footer}>
        <Typography className={classes.copyright}>	&#169; SRS MUTT</Typography>
      </BottomNavigation>
    </div>
  );
}
