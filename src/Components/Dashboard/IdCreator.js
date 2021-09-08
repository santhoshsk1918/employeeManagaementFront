/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { makeStyles } from "@material-ui/core";
import logo192 from "../../Assets/images/logo192.png";
import sign from "../../Assets/images/sign.png";
import swamy from "../../Assets/images/swamy.png";
import moment from "moment";

const useStyles = makeStyles((theme) => {
  return {
    media: {
      width: "100px",
      height: "100px",
      borderRadius: "10px",
    },
    imageContainer: {
      display: "grid",
      "grid-template-columns": "110px 1fr",
      gridGap: "20px",
      height: "120px",
      padding: "10px",
    },
    cardContainer: {
      width: "450px",
      height: "270px",
      border: `1px solid ${theme.palette.primary.main}`,
    },
    nameSection: {
      marginTop: "0px",
    },
    logoImage: {
      height: "60px",
      width: "60px",
      "margin-top": "5px",
    },
    logoImage2:{
      height: "50px",
      width: "50px",
      "margin-top": "10px",
    },
    headerContainer: {
      height: "70px",
      display: "grid",
      "grid-template-columns": "1fr 6fr 1fr",
      backgroundColor: theme.palette.primary.main,
    },
    headerText: {
      color: "#FFF",
      "font-weight": "600",
    },
    headerSubheading: {
      color: "#FFF",
      fontWeight: "400",
      fontSize: "0.60em",
      marginTop: "-4px",
    },
    logoText: {
      display: "grid",
      "grid-template-rows": "1fr 2fr 2fr 1fr",
      textAlign: "center",
      color: "#FFF",
    },
    signatureSection: {
      width: "450px",
      "grid-gap": "80px",
      display: "grid",
      marginTop: "-5px",
      "grid-template-columns": "1fr 1fr",
    },
    sign: {
      height: "30px",
      window: "50px",
      "align-item": "end",
      marginLeft: "20px",
    },
    signatureIssuing: {
      display: "grid",
      "grid-template-rows": "1fr 1fr",
    },
    headerSmallText: {
      fontSize: "0.6em",
    },
    headerContact: {
      fontSize: "0.6em",
      marginTop: "-15px",
    },
    image: {
      marginTop: "15px",
      marginRight: "2px",
    },
    issueDate: {
      fontSize: "0.6em"
    },
    validDate: {
      fontSize: "0.6em"
    },
    backDetails:{
      width: "450px"
    }
  };
});

export default function IdCreator({
  employeeItem,
  designationList,
  front
}) {
  const classes = useStyles();
  let designation = designationList.find(
    (item) => item.designationKey === employeeItem.designation
  );
  return (
    <>
     {front ? 
      <div className={classes.cardContainer}>
        <div className={classes.headerContainer}>
          <img src={logo192} className={classes.logoImage}></img>
          <div className={classes.logoText}>
            <span className={classes.headerSmallText}>
              Jagadguru Sriman Madhwacharya Moola Mahasamasthanam
            </span>
            <span className={classes.headerText}>
              Nanjanagud Sri Raghavendra Swamy Mutt
            </span>
            <span className={classes.headerSubheading}>
              Regional Office: 4, Seethapathi Agrahara, New Tharagupet,
              Bangalore 560002
            </span>
            <span className={classes.headerContact}>
              <span style={{ marginRight: "5px" }}>
                email: nsrscobang@gmail.com
              </span>{" "}
              |<span style={{ marginLeft: "5px" }}>Ph No: 080-26704584 </span>
            </span>
          </div>
          <img src={swamy} className={classes.logoImage2}></img>
        </div>
        <div className={classes.imageContainer}>
          <div className={classes.image}>
            <img
              src={`${process.env.REACT_APP_BASE_URL}/files/download?type=profile&reference=${employeeItem.empno}`}
              className={classes.media}
            ></img>
          </div>
          <div className={classes.nameSection}>
            <span
              style={{
                float: "right",
                "font-size": "0.67em",
                fontWeight: "bold",
              }}
            >
              <i>Employee No:</i> {employeeItem.empno}
            </span>
            <br />
            <div style={{ borderBottom: "1px solid #ececec" }}></div>
            <span style={{ fontWeight: "bolder", "font-size": "1.1em" }}>
              {employeeItem.name}
            </span>
            <br />
            <span style={{ "font-size": "0.8em" }}>
              {designation ? designation.designation : employeeItem.designation} 
              {employeeItem.contractEmployee ? " (Contract)" : null}
            </span>
            <br />
            <span style={{ "font-size": "0.8em" }}>
              <i>PF No : </i>
              {employeeItem.pfno}
            </span>
            <br />
            <span style={{ "font-size": "0.8em" }}>
              <i>Uan No : </i>
              {employeeItem.uanno}
            </span>
          </div>
          <div className={classes.signatureSection}>
            <div>
              <span className={classes.issueDate}></span>
              <br />
              <span className={classes.validDate}>Date of Issue: 24 August 2021 </span>
            </div>
            <div className={classes.signatureIssuing}>
              <img src={sign} className={classes.sign} />
              <span>Regional Manager </span>
            </div>
          </div>
        </div>
      </div>
    : <div className={classes.cardContainer}>
    <div>
    </div>
    <div className={classes.imageContainer}>
      <div className={classes.image} style={{height: "60px"}}>
      </div>
      <div className={classes.nameSection}>
        
      </div>
      <div className={classes.backDetails} style={{marginLeft: "110px"}}>
        <span><b>Employee Number:</b> {employeeItem.empno}</span> <br />
        <span><b>Phone No:</b> {employeeItem.empMobile}</span><br />
        <span><b>Blood Group:</b> {employeeItem.bloodGroup}</span><br />
        <span><b>Date of Birth:</b> {employeeItem.dob ? moment(employeeItem.dob).format("DD MMMM YYYY") : ""}</span>
      </div>
    </div>
  </div>}
    </>
  );
}
