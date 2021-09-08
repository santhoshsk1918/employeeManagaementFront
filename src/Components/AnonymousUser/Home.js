import React, { useContext } from "react";
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import formTheme from "../../Themes/formTheme";
import logo512 from "../../Assets/images/raghavendraSwamy.png";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import actions from "../../Context/Actions";

require("dotenv").config();

const pageStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: "10px",
    margin: "20px",
  },
  formContainer: {
    padding: "10px",
  },
  marginExtra: {
    marginTop: "5px",
  },
  imageItem: {
    objectFit: "contain",
    marginLeft: "10vw",
    [theme.breakpoints.only("sm")]: {
      height: "400px",
      width: "400px",
      marginLeft: "25vw",
    },
    [theme.breakpoints.down("xs")]: {
      height: "300px",
      width: "300px",
      marginLeft: "10vw",
    },
  },
  errorMargin: {
    marginTop: "-5px",
  },
  buttonMargin: {
    marginTop: "25px",
    width: "40%",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "25vw",
    },
  },
  splitter: {
    borderBottom: "1px solid #CDCDCD",
    width: "100%",
    marginTop: "15px",
    height: "1px",
    marginBottom: "20px",
  },
  forgotPassword: {
    float: "left",
    marginTop: "-10px",
  },
  actionButton: {
    width: "100%",
    textAlign: "center",
  },
}));

export default function Home() {
  const initialValues = {
    userName: "",
    password: "",
  };

  const { setLoggedInUser } = useContext(UserContext);

  const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;

  const validationSchema = Yup.object({
    userName: Yup.string("Enter your Email/phone")
      .required("Enter you email/phone")
      .test("check-mobile", "Enter Valid Email/Phone", function (value) {
        const emailRegex =
          /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        const phoneRegex = /^(9|8|7|6){1}\d{9}$/; // Change this regex based on requirement
        let isValidEmail = emailRegex.test(value);
        let isValidPhone = phoneRegex.test(value);
        if (!isValidEmail && !isValidPhone) {
          return false;
        }
        return true;
      }),
    password: Yup.string().required("Please Enter a valid password"),
  });

  const onSubmit = (values) => {
    let baseUrl = process.env.REACT_APP_BASE_URL;
    axios({
      url: `${baseUrl}/users/signIn`,
      method: "POST",
      data: values,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setLoggedInUser({ type: actions.LOGIN_USER, payload: response.data });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  let formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  let classes = pageStyles();

  const onResponseGoogle = (response) => {
    let { id_token } = response.tokenObj;
    let baseUrl = process.env.REACT_APP_BASE_URL;
    axios({
      url: `${baseUrl}/users/googleLogin`,
      method: "POST",
      data: { googleToken: id_token },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setLoggedInUser({ type: actions.LOGIN_USER, payload: response.data });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onErrorResponseGoogle = (response) => {
    alert("Google Login Error");
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid xs={12} md={6} item={true}>
          <img src={logo512} alt={"Login"} className={classes.imageItem} />
        </Grid>
        <Grid xs={12} md={6} item={true}>
          <Paper
            elevation={3}
            alignContent="center"
            alignItems="center"
            className={classes.paperContainer}
          >
            <Grid className={classes.formContainer}>
              <Typography variant="h5">Login</Typography>
              <form
                noValidate
                autoComplete="off"
                onSubmit={formik.handleSubmit}
              >
                <Grid container>
                  <ThemeProvider theme={formTheme}>
                    <TextField
                      label="Username"
                      variant="standard"
                      name="userName"
                      fullWidth
                      type="text"
                      id="userName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.userName}
                      error={formik.touched.userName && formik.errors.userName}
                      color="primary"
                      margin="dense"
                      gutterBottom
                      placeholder="Please Enter you mobile or email"
                      className={classes.marginExtra}
                    />
                    {formik.touched.userName && formik.errors.userName ? (
                      <Typography variant="caption" color="error">
                        {formik.errors.userName}
                      </Typography>
                    ) : null}

                    <TextField
                      label="Password"
                      variant="standard"
                      name="password"
                      fullWidth
                      type="password"
                      id="password"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      error={formik.touched.password && formik.errors.password}
                      color="primary"
                      margin="dense"
                      gutterBottom
                      classes={classes.marginExtra}
                    />

                    {formik.touched.password && formik.errors.password ? (
                      <Typography
                        variant="caption"
                        color="error"
                        align="center"
                      >
                        {formik.errors.password}
                      </Typography>
                    ) : null}
                  </ThemeProvider>
                </Grid>
                <Grid
                  xs={12}
                  md={12}
                  className={classes.actionButton}
                  item={true}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.buttonMargin}
                  >
                    Submit
                  </Button>

                  <div className={classes.splitter} />
                  <GoogleLogin
                    clientId={clientId}
                    buttonText="Login with Google"
                    onSuccess={onResponseGoogle}
                    onFailure={onErrorResponseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                </Grid>
              </form>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
