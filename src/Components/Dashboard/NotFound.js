import { makeStyles } from '@material-ui/core';
import React from 'react'
import NotFoundImage from "../../Assets/images/NotFoundImage.png";

const useStyles = makeStyles((theme) => {
    return {
      NotFoundImage: {
          marginLeft: "20vw",
          [theme.breakpoints.down("sm")]: {
            marginLeft: "0vw",
            width: 300
          },
      }
    };
  });

export default function NotFound() {
    const classes = useStyles();
    return (
        <div>
            <img src={NotFoundImage} alt={"Not Found"} className={classes.NotFoundImage}/>
        </div>
    )
}
