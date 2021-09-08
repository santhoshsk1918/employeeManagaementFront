import {
  Box,
  Button,
  Card,
  CardActions,
  Grid,
  makeStyles,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { EmployeeContext } from "../../Context/EmployeeContext";
import { UserContext } from "../../Context/UserContext";
import formTheme from "../../Themes/formTheme";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => {
  return {
    content: {
      paddingLeft: "10px",
      padding: "5px",
    },
    formContent: {
      padding: "10px",
    },
    nativeSelect: {
      width: "100%",
    },
    buttonMargin: {
      marginRight: theme.spacing(2),
    },
    bulkButtonContainer: {
      direction: "rtl",
      marginRight: "20px",
    },
    cardContainer: {
      minWidth: "200px",
      padding: "2px 10px 2px 10px",
      margin: "10px",
    },
  };
});

export default function AddDesignation() {
  const classes = useStyles();
  const [selectedBulkUpload, setSelectedBulkUpload] = useState(null);
  const { loggedInUser } = useContext(UserContext);
  const { getDesignationList, employeeData } = useContext(EmployeeContext);
  const designationList = employeeData ? employeeData.designationList : [];
  const [isEditing, setIsEditing] = useState(false);
  let initialValues = {
    designation: "",
    designationKey: "",
  };

  const validationSchema = Yup.object({
    designation: Yup.string().required("Please Enter Designation Title"),
    designationKey: Yup.string().required("DesignationKey cannot be empty"),
  });

  const onSubmit = async (values) => {
    try {
      setIsEditing(false);
      let response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/employee/createDesignation`,
        data: values,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
        method: "POST",
      });

      if (response.status === 200) {
        getDesignationList(true);
        formik.resetForm();
      }
    } catch (err) {
      window.alert("Error Submitting Designation");
    }
  };

  let formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const handleDesignationKeyUp = (event) => {
    let value = event.target.value;
    let keyValue = value ? value.replace(/ +?/g, "-").toLowerCase() : "";
    if(!isEditing){
      formik.setFieldValue("designationKey", keyValue, true);
    }

  };

  const handleDesignationKey_KeyUp = (event) => {
    formik.setFieldValue(
      "designationKey",
      event.target.value ? event.target.value.trim().toLowerCase() : "",
      true
    );
  };

  const bulkFileOnChange = (event) => {
    let file = event.target.files[0];
    let ext = file.name.split(".").pop();
    let selectedFile = event.target.files[0];
    if (ext === "csv") {
      setSelectedBulkUpload(selectedFile);
      const formData = new FormData();
      formData.append("File", selectedFile);
      formData.append("FileType", "BULK_BRANCH_UPLOAD");
      axios({
        url: `${process.env.REACT_APP_BASE_URL}/file/upload`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
        data: formData,
      })
        .then((resp) => {
          console.log(resp);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.alert("Please upload csv files only");
    }
  };

  const editDesignation = (key) => {
    setIsEditing(true);
    let designationItem = designationList.find(
      (item) => item.designationKey === key
    );
    if (designationItem) {
      formik.setFieldValue(
        "designationKey",
        designationItem.designationKey,
        true
      );
      formik.setFieldValue("designation", designationItem.designation, true);
    } else {
      alert("Error Edditing");
    }
  };

  return (
    <div>
      <React.Fragment>
        <Grid container className={classes.content}>
          <Grid item={true} direction={"row"}>
            <Typography variant={"h5"} component={"h1"} color="secondary">
              Designations
            </Typography>
          </Grid>
          <Grid container className={classes.bulkButtonContainer}>
            <Button variant="contained" color="primary" component="label">
              Bulk Upload
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={bulkFileOnChange}
              />
            </Button>
            <Typography
              variant={"body2"}
              style={{ "margin-right": "20px", marginTop: "10px" }}
            >
              {selectedBulkUpload
                ? selectedBulkUpload.name || "File Select Error"
                : null}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item className={classes.content}>
          <Grid item xs={12} sm={3} md={3}>
            <form onSubmit={formik.handleSubmit} noValidate>
              <Typography variant={"h5"}>{isEditing ? "Edit Branch" : "Add Branch"}</Typography>
              <ThemeProvider theme={formTheme}>
                <TextField
                  label="Designation Name"
                  variant="standard"
                  name="designation"
                  fullWidth
                  type="text"
                  id="designation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  onKeyUp={handleDesignationKeyUp}
                  value={formik.values.designation}
                  error={
                    formik.touched.designation && formik.errors.designation
                  }
                  color="primary"
                  gutterBottom
                  placeholder="Please Enter Designation"
                />
                {formik.touched.designation && formik.errors.designation ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.designation}
                  </Typography>
                ) : null}

                <TextField
                  label="Desingation Key"
                  variant="standard"
                  name="designationKey"
                  fullWidth
                  type="text"
                  id="designationKey"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  onKeyUp={handleDesignationKey_KeyUp}
                  value={formik.values.designationKey}
                  disabled={isEditing ? true : false}
                  error={
                    formik.touched.designationKey &&
                    formik.errors.designationKey
                  }
                  color="primary"
                  gutterBottom
                  placeholder="Please Enter Designation Key"
                />
                {formik.touched.designationKey &&
                formik.errors.designationKey ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.designationKey}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="info">
                    Cannot be changed later. Cannot Contain spaces
                  </Typography>
                )}
              </ThemeProvider>
              <Box
                alignContent="center"
                style={{ marginTop: "20px", marginLeft: "10px" }}
              >
                <Button variant="contained" color="primary" type={"submit"}>
                  Submit
                </Button>
              </Box>
            </form>
          </Grid>
          <Grid
            direction={"column"}
            xs={12}
            sm={1}
            md={1}
            item={true}
            className={classes.formContent}
          ></Grid>
          <Grid item xs={12} sm={8} md={8}>
            <Grid container item alignItems={"center"}>
              {designationList && designationList.length > 0 ? (
                designationList.map((item) => (
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" className={classes.cardContainer}>
                      <Typography variant="h6" color="textSecondary">
                        {item.designation}
                      </Typography>
                      <Typography variant="body2" color="textPrimary">
                        {item.designationKey}
                      </Typography>
                      <CardActions>
                        <Button
                          color="primary"
                          size="small"
                          style={{ paddingLeft: "0px" }}
                          startIcon={<EditIcon />}
                          onClick={() => editDesignation(item.designationKey)}
                        >
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant={"h5"}>
                  Please Create a Designation
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    </div>
  );
}
