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
import React, { useContext, useState } from "react";
import formTheme from "../../Themes/formTheme";
import * as Yup from "yup";
import { useFormik } from "formik";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { EmployeeContext } from "../../Context/EmployeeContext";
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

export default function AddRegion() {
  const classes = useStyles();

  const [selectedBulkUpload, setSelectedBulkUpload] = useState(null);
  const { loggedInUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const {employeeData, getBranchList} = useContext(EmployeeContext);
  const branchList = employeeData ? employeeData.branchList : [];

  let initialValues = {
    region: "",
    zone: "",
    branch: "",
    branchKey: "",
  };

  const validationSchema = Yup.object({
    region: Yup.string().required("Please Enter Branch Region"),
    zone: Yup.string().required("Please Enter Branch Zone"),
    branch: Yup.string().required("Please Enter Branch Name"),
    branchKey: Yup.string().required("BranchKey cannot be empty"),
  });

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
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
        method: "POST",
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

  const onSubmit = async (values) => {
    try {
      let response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/employee/createBranch`,
        data: values,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
        method: "POST",
      });
      if(response.status === 200){
        getBranchList(true);
        setIsEditing(false);
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

  const handleBranchNameKeyUp = (event) => {
    let value = event.target.value;
    if (!isEditing) {
      let keyValue = value ? value.replace(/ +?/g, "-").toLowerCase() : "";
      formik.setFieldValue("branchKey", keyValue, true);
    }
  };

  const handleBranchKey_KeyUp = (event) => {
    formik.setFieldValue(
      "branchKey",
      event.target.value ? event.target.value.trim().toLowerCase() : "",
      true
    );
  };

  const editBranch = (key) => {
    let editBranchItem = branchList.find(item => item.branchKey === key);
    if(editBranchItem){
      setIsEditing(true);
      formik.setFieldValue("region", editBranchItem.region, true);
      formik.setFieldValue("zone", editBranchItem.zone, true);
      formik.setFieldValue("branch", editBranchItem.branch, true);
      formik.setFieldValue("branchKey", editBranchItem.branchKey, true);
    }else{
      alert("Error Editing the Branch");
    }
  }

  return (
    <React.Fragment>
      <Grid container className={classes.content}>
        <Grid item={true} direction={"row"}>
          <Typography variant={"h5"} component={"h1"} color="secondary">
            Brnaches
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
          <Typography variant={"h5"}>{isEditing ? "Edit Branch" : "Add Branch"}</Typography>
          <form noValidate onSubmit={formik.handleSubmit}>
            <ThemeProvider theme={formTheme}>
              <TextField
                label="Branch Name"
                variant="standard"
                name="branch"
                fullWidth
                type="text"
                id="branch"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                onKeyUp={handleBranchNameKeyUp}
                value={formik.values.branch}
                error={formik.touched.branch && formik.errors.branch}
                color="primary"
                gutterBottom
                placeholder="Please Enter Employee Name"
              />
              {formik.touched.branch && formik.errors.branch ? (
                <Typography variant="caption" color="error">
                  {formik.errors.branch}
                </Typography>
              ) : null}

              <TextField
                label="Branch Key"
                variant="standard"
                name="branchKey"
                fullWidth
                type="text"
                id="branchKey"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                onKeyUp={handleBranchKey_KeyUp}
                value={formik.values.branchKey}
                error={formik.touched.branchKey && formik.errors.branchKey}
                color="primary"
                gutterBottom
                disabled={isEditing}
                placeholder="Please Enter Branch key"
              />
              {formik.touched.branchKey && formik.errors.branchKey ? (
                <Typography variant="caption" color="error">
                  {formik.errors.branchKey}
                </Typography>
              ) : (
                <Typography variant="caption" color="info">
                  Cannot be changed later. Cannot Contain spaces
                </Typography>
              )}

              <TextField
                label="Region"
                variant="standard"
                name="region"
                fullWidth
                type="text"
                id="region"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.region}
                error={formik.touched.region && formik.errors.region}
                color="primary"
                gutterBottom
                placeholder="Please Enter Branch Region"
              />
              {formik.touched.region && formik.errors.region ? (
                <Typography variant="caption" color="error">
                  {formik.errors.region}
                </Typography>
              ) : null}

              <TextField
                label="Zone"
                variant="standard"
                name="zone"
                fullWidth
                type="text"
                id="zone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.zone}
                error={formik.touched.zone && formik.errors.zone}
                color="primary"
                gutterBottom
                placeholder="Please Enter Employee Name"
              />
              {formik.touched.zone && formik.errors.zone ? (
                <Typography variant="caption" color="error">
                  {formik.errors.zone}
                </Typography>
              ) : null}
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
              {branchList && branchList.length > 0 ? (
                branchList.map((item) => (
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" className={classes.cardContainer}>
                      <Typography variant="h6" color="textSecondary">
                        {item.branch}
                      </Typography>
                      <Typography variant={"body1"} color="textPrimary">
                        {item.zone} - {item.region}
                      </Typography>
                      <Typography variant="body2" color="textPrimary">
                        {item.branchKey}
                      </Typography>
                      <CardActions>
                        <Button
                          color="primary"
                          size="small"
                          style={{ paddingLeft: "0px" }}
                          startIcon={<EditIcon />}
                          onClick={() => editBranch(item.branchKey)}
                        >
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant={"h5"}>
                  Please Create a Branch
                </Typography>
              )}
            </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
