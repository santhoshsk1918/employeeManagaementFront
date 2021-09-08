/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  ThemeProvider,
  TextField,
  FormControl,
  InputLabel,
  NativeSelect,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import formTheme from "../../Themes/formTheme";
import * as Yup from "yup";
import { useFormik } from "formik";
import { EmployeeContext } from "../../Context/EmployeeContext";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import IdCreator from "./IdCreator";
import CancelIcon from "@material-ui/icons/Cancel";
import { exportComponentAsJPEG } from "react-component-export-image";

const useStyles = makeStyles((theme) => {
  return {
    content: {
      paddingLeft: "10px",
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
  };
});

export default function AddEmployee({ prop }) {
  const classes = useStyles();
  const [branchesList, setBranchesList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const { employeeData, getEmployeeList } = useContext(EmployeeContext);
  const { loggedInUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [employeeItem, setEmployeeItem] = useState(null);
  const [repeatedEmpNo, setRepeatedEmpNo] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [generatingId, setGeneratingId] = useState(false);
  const params = useParams();
  const history = useHistory();
  const componentRef = useRef();
  const componentBackRef = useRef();
  let id = params ? params.id : "";

  let initialValues = {
    name: "",
    designation: "",
    branch: "",
    image: "",
    adhar: "",
    pfno: "",
    gender: "",
    uanno: "",
    empno: "",
    profileImage: "Upload Photo",
    bloodGroup: "",
    empMobile: "",
    dob: "",
    contractEmployee: "false"
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3).required("Please Enter Employee's Name"),
    password: Yup.string().required("Please Enter a valid password"),
    branch: Yup.string().required("Please select a branch"),
    designation: Yup.string().required("Please select a Designation"),
    adhar: Yup.string()
      .matches(
        /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
        "Please Enter Valid Adhar"
      ),
    pfno: Yup.string(),
    gender: Yup.string()
      .required("Please Select Gender")
      .oneOf(["Male", "Female"], "Please Select a Gender"),
    bloodGroup: Yup.string()
      .required("Please Select Blood Group")
      .oneOf(
        [
          "A Positive",
          "A Negative",
          "B Positive",
          "B Negative",
          "AB Positive",
          "AB Negative",
          "O Positive",
          "O Negative",
        ],
        "Please Select a Blood Group"
      ),
    dob: Yup.string(),
    empMobile: Yup.string(),
    uanno: Yup.string(),
    empno: Yup.string().test(
      "check-new-empno",
      "This Employee Number already exists please edit",
      function (value) {
        let employeeList = employeeData ? employeeData.employeeList : [];
        let empData = employeeList.find((item) => item.empno === value);
        if (empData) {
          id = empData._id;
          setEmployeeItem(empData);
          setIsEditing(true);
          setRepeatedEmpNo(true);
          return true;
        } else {
          setRepeatedEmpNo(false);
          return true;
        }
      }
    ),
    contractEmployee: Yup.string()
      .required("Please Select Contract")
      .oneOf(["false", "true"], "Please Select a Contract Employee Status"),
  });

  const generateCard = () => {
    setGeneratingId(true);
  };

  const closeIdGenerator = () => {
    setGeneratingId(false);
  };

  const editEmployee = () => {
    formik.setFieldValue(
      "profileImage",
      employeeItem.profileImageName
        ? employeeItem.profileImageName
        : "Upload Photo",
      true
    );
    formik.setFieldValue("name", employeeItem.name, true);
    formik.setFieldValue("designation", employeeItem.designation, true);
    formik.setFieldValue("branch", employeeItem.branch, true);
    formik.setFieldValue("adhar", employeeItem.adhar, true);
    formik.setFieldValue("pfno", employeeItem.pfno, true);
    formik.setFieldValue("gender", employeeItem.gender, true);
    formik.setFieldValue("uanno", employeeItem.uanno, true);
    formik.setFieldValue("empno", employeeItem.empno, true);
    formik.setFieldValue("bloodGroup", employeeItem.bloodGroup, true);
    formik.setFieldValue("empMobile", employeeItem.empMobile, true);
    formik.setFieldValue("dob", employeeItem.dob, true);
    formik.setFieldValue("contractEmployee", employeeItem.contractEmployee, true)
  };

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("profileImage", profileImage);
    if (isEditing) {
      formData.append("profileImageName", employeeItem.profileImageName);
    }
    formData.append("name", formik.values.name);
    formData.append("designation", formik.values.designation);
    formData.append("branch", formik.values.branch);
    formData.append("adhar", formik.values.adhar);
    formData.append("pfno", formik.values.pfno);
    formData.append("gender", formik.values.gender);
    formData.append("uanno", formik.values.uanno);
    formData.append("empno", formik.values.empno);
    formData.append("bloodGroup", formik.values.bloodGroup);
    formData.append("dob", formik.values.dob);
    formData.append("empMobile", formik.values.empMobile);
    formData.append("contractEmployee", formik.values.contractEmployee === "true")

    let response = await axios({
      url: `${process.env.REACT_APP_BASE_URL}/employee/createEmployee`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${loggedInUser.accessToken}`,
      },
      data: formData,
    });

    if (response.status === 200) {
      getEmployeeList(true);
      history.push("/");
    }
  };

  let formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const profileImageOnChange = (event) => {
    let file = event.target.files[0];
    let ext = file.name.split(".").pop();
    let selectedFile = event.target.files[0];
    ext = ext.toLowerCase();
    if (ext === "jpg" || ext === "jpeg" || ext === "webp" || ext === "png") {
      formik.setFieldValue("profileImage", file.name, false);
      setProfileImage(selectedFile);
    } else {
      alert("Please Upload an Image");
    }
  };

  useEffect(() => {
    setBranchesList(employeeData.branchList);
    setDesignationList(employeeData.designationList);
    if (!(id === "" || id === undefined || id === null)) {
      let employeeList = employeeData.employeeList;
      let empItem = employeeList.find((item) => item._id === id);
      setEmployeeItem(empItem);
    }
  }, [employeeData, isEditing]);

  useEffect(() => {
    if (employeeItem) editEmployee();
  }, [employeeItem]);

  useEffect(() => {
    setIsEditing(id === "" || id === undefined || id === null ? false : true);
  }, []);

  return (
    <React.Fragment>
      <Grid container className={classes.content} direction={"row"}>
        <Grid item={true} direction={"row"}>
          <Typography variant={"h5"} component={"h1"} color="secondary">
            {generatingId
              ? "Generate Id"
              : isEditing
              ? "Edit Employee"
              : "Add Employee"}
          </Typography>
        </Grid>
        <Grid container className={classes.bulkButtonContainer}>
          <Button variant="contained" color="primary" component="label">
            Bulk Upload
            <input type="file" hidden accept=".csv" />
          </Button>
        </Grid>
      </Grid>

      <form noValidate onSubmit={formik.handleSubmit}>
        <div hidden={generatingId}>
          <Grid container className={classes.content} direction={"row"}>
            <ThemeProvider theme={formTheme}>
              <Grid
                direction={"column"}
                xs={12}
                md={3}
                item={true}
                className={classes.formContent}
              >
                <Typography variant={"subtitle2"}>
                  Personal Information
                </Typography>
                <TextField
                  label="Name"
                  variant="standard"
                  name="name"
                  fullWidth
                  type="text"
                  id="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  error={formik.touched.name && formik.errors.name}
                  color="primary"
                  gutterBottom
                  placeholder="Please Enter Employee Name"
                />
                {formik.touched.name && formik.errors.name ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.name}
                  </Typography>
                ) : null}

                <FormControl fullWidth>
                  <InputLabel
                    error={formik.touched.branch && formik.errors.branch}
                  >
                    Gender
                  </InputLabel>
                  <NativeSelect
                    native
                    value={formik.values.gender}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="standard"
                    id="gender"
                    name="gender"
                    color="primary"
                    error={formik.touched.gender && formik.errors.gender}
                  >
                    <option value="" aria-label="Please Select Gender" />
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </NativeSelect>
                </FormControl>
                {formik.touched.gender && formik.errors.gender ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.gender}
                  </Typography>
                ) : null}

                <TextField
                  label="Adhar"
                  variant="standard"
                  name="adhar"
                  fullWidth
                  type="text"
                  id="adhar"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.adhar}
                  error={formik.touched.adhar && formik.errors.adhar}
                  color="primary"
                  gutterBottom
                  placeholder="Please Enter Employee Adhar No"
                />
                {formik.touched.adhar && formik.errors.adhar ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.adhar}
                  </Typography>
                ) : null}

                <TextField
                  label="Date of Birth"
                  variant="standard"
                  name="dob"
                  fullWidth
                  type="date"
                  id="dob"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.dob}
                  error={formik.touched.dob && formik.errors.dob}
                  color="primary"
                  gutterBottom
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {formik.touched.dob && formik.errors.dob ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.dob}
                  </Typography>
                ) : null}

                <TextField
                  label="Employee Mobile"
                  variant="standard"
                  name="empMobile"
                  fullWidth
                  type="text"
                  id="empMobile"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.empMobile}
                  error={formik.touched.empMobile && formik.errors.empMobile}
                  color="primary"
                  inputProps={{ maxLength: 10 }}
                  gutterBottom
                  placeholder="Please Enter Employee PF Number"
                />
                {formik.touched.empMobile && formik.errors.empMobile ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.empMobile}
                  </Typography>
                ) : null}

                <FormControl fullWidth>
                  <InputLabel
                    error={
                      formik.touched.bloodGroup && formik.errors.bloodGroup
                    }
                  >
                    Blood Group
                  </InputLabel>
                  <NativeSelect
                    native
                    value={formik.values.bloodGroup}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="standard"
                    id="bloodGroup"
                    name="bloodGroup"
                    color="primary"
                    error={
                      formik.touched.bloodGroup && formik.errors.bloodGroup
                    }
                  >
                    <option value="" aria-label="Please Blood Group" />
                    <option value="A Positive">A Positive</option>
                    <option value="A Negative">A Negative</option>
                    <option value="B Positive">B Positive</option>
                    <option value="B Negative">B Negative</option>
                    <option value="AB Positive">AB Positive</option>
                    <option value="AB Negative">AB Negative</option>
                    <option value="O Positive">O Positive</option>
                    <option value="O Negative">O Negative</option>
                  </NativeSelect>
                </FormControl>
                {formik.touched.bloodGroup && formik.errors.bloodGroup ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.bloodGroup}
                  </Typography>
                ) : null}

                <FormControl fullWidth>
                  <br />
                  <Button variant="contained" color="primary" component="label">
                    {formik.values.profileImage}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={profileImageOnChange}
                    />
                  </Button>
                </FormControl>
                {isEditing ? (
                  <img
                    width="200"
                    height="200"
                    alt={`${
                      process.env.REACT_APP_BASE_URL
                    }/files/download?type=Profile&reference=${
                      isEditing ? (employeeItem ? employeeItem.empno : "") : ""
                    }`}
                    src={`${
                      process.env.REACT_APP_BASE_URL
                    }/files/download?type=Profile&reference=${
                      isEditing ? (employeeItem ? employeeItem.empno : "") : ""
                    }`}
                  ></img>
                ) : null}
              </Grid>
            </ThemeProvider>
            <Grid
              direction={"column"}
              xs={12}
              md={1}
              item={true}
              className={classes.formContent}
            ></Grid>
            <Grid
              direction={"column"}
              xs={12}
              md={3}
              item={true}
              className={classes.formContent}
            >
              <ThemeProvider theme={formTheme}>
                <Typography variant={"subtitle2"}>
                  Professional Information
                </Typography>
                <TextField
                  label="Employee Number"
                  variant="standard"
                  name="empno"
                  fullWidth
                  type="text"
                  id="empno"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={isEditing ? true : false}
                  value={formik.values.empno}
                  error={formik.touched.empno && formik.errors.empno}
                  color="primary"
                  gutterBottom
                  placeholder="Please Enter Employee PF Number"
                />
                {formik.touched.empno && formik.errors.empno ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.empno}
                  </Typography>
                ) : null}
                {repeatedEmpNo && !isEditing ? (
                  <Typography variant="caption" color="error">
                    Employee Number Exists, Switched to Editing
                  </Typography>
                ) : null}

                <FormControl fullWidth>
                  <InputLabel
                    error={formik.touched.branch && formik.errors.branch}
                  >
                    Select Branch
                  </InputLabel>
                  <NativeSelect
                    native
                    value={formik.values.branch}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="standard"
                    inputProps={{
                      branch: "",
                      region: "",
                      branchKey: "",
                    }}
                    id="branch"
                    name="branch"
                    color="primary"
                    error={formik.touched.branch && formik.errors.branch}
                  >
                    <option value="" aria-label="Please Select Branch" />
                    {branchesList ? (
                      branchesList.map((item) => (
                        <option value={item.branchKey}>{item.branch}</option>
                      ))
                    ) : (
                      <option>No Branch</option>
                    )}
                  </NativeSelect>
                </FormControl>
                {formik.touched.branch && formik.errors.branch ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.branch}
                  </Typography>
                ) : null}

                <FormControl fullWidth>
                  <InputLabel
                    error={
                      formik.touched.designation && formik.errors.designation
                    }
                  >
                    Select Designation
                  </InputLabel>
                  <NativeSelect
                    native
                    value={formik.values.designation}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="standard"
                    inputProps={{
                      designation: "",
                      designationKey: "",
                    }}
                    id="designation"
                    name="designation"
                    color="primary"
                    error={
                      formik.touched.designation && formik.errors.designation
                    }
                  >
                    <option value="" aria-label="Please Select Designation" />
                    {designationList.map((item) => (
                      <option value={item.designationKey}>
                        {item.designation}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                {formik.touched.designation && formik.errors.designation ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.designation}
                  </Typography>
                ) : null}

                <TextField
                  label="PF Number"
                  variant="standard"
                  name="pfno"
                  fullWidth
                  type="text"
                  id="pfno"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.pfno}
                  error={formik.touched.pfno && formik.errors.pfno}
                  color="primary"
                  gutterBottom
                  placeholder="Please Enter Employee PF Number"
                />
                {formik.touched.pfno && formik.errors.pfno ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.pfno}
                  </Typography>
                ) : null}

                <TextField
                  label="UAN Number"
                  variant="standard"
                  name="uanno"
                  fullWidth
                  type="text"
                  id="uanno"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.uanno}
                  error={formik.touched.uanno && formik.errors.uanno}
                  color="primary"
                  gutterBottom
                  placeholder="Please Enter Employee PF Number"
                />
                {formik.touched.uanno && formik.errors.uanno ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.uanno}
                  </Typography>
                ) : null}

              <FormControl fullWidth>
                  <InputLabel
                    error={formik.touched.contractEmployee && formik.errors.contractEmployee}
                  >
                    Is Contract Employee
                  </InputLabel>
                  <NativeSelect
                    native
                    value={formik.values.contractEmployee}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="standard"
                    id="contractEmployee"
                    name="contractEmployee"
                    color="primary"
                    error={formik.touched.contractEmployee && formik.errors.contractEmployee}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </NativeSelect>
                </FormControl>
                {formik.touched.contractEmployee && formik.errors.contractEmployee ? (
                  <Typography variant="caption" color="error">
                    {formik.errors.contractEmployee}
                  </Typography>
                ) : null}
              </ThemeProvider>
            </Grid>
            <Grid
              direction={"column"}
              xs={12}
              md={1}
              item={true}
              className={classes.formContent}
            ></Grid>
            <Grid
              direction={"column"}
              xs={12}
              md={3}
              item={true}
              className={classes.formContent}
            >
              <Typography variant={"subtitle2"}>Office Files</Typography>

              <ButtonGroup
                variant="vertical"
                color="primary"
                aria-label="split button"
              >
                <Button
                  variant="contained"
                  color="primary"
                  component="label"
                  className={classes.buttonMargin}
                >
                  Upload Photo
                  <input type="file" hidden accept="image/*" />
                </Button>
                <NativeSelect>
                  <option>Form 16</option>
                </NativeSelect>
              </ButtonGroup>
            </Grid>
          </Grid>
        </div>
        {generatingId ? (
          <Grid container className={classes.content} direction={"row"}>
            <Button
              startIcon={<CancelIcon />}
              variant="standard"
              color={"primary"}
              onClick={closeIdGenerator}
            >
              Close
            </Button>
          </Grid>
        ) : null}
        <Grid
          container
          className={classes.content}
          direction={"row"}
          style={{ marginTop: "10px" }}
        >
          {generatingId ? (
            <>
              <div ref={componentRef}>
                <IdCreator
                  employeeItem={employeeItem}
                  designationList={designationList}
                  branchList={branchesList}
                  ref={componentRef}
                  front={true}
                />
              </div>

              <div ref={componentBackRef} style={{ marginLeft: "10px" }}>
                <IdCreator
                  employeeItem={employeeItem}
                  designationList={designationList}
                  branchList={branchesList}
                  ref={componentBackRef}
                />
              </div>
            </>
          ) : null}
        </Grid>
        <Grid
          container
          className={classes.content}
          direction={"row"}
          style={{ marginTop: "30px" }}
        >
          <Grid xs={12} md={5} item></Grid>
          <Grid xs={12} md={6} item style={{ marginBottom: "10px" }}>
            <div hidden={generatingId}>
              <ButtonGroup variant="contained" disableElevation>
                <Button
                  variant="contained"
                  color="primary"
                  type={"submit"}
                  fullWidth={false}
                  style={{ marginRight: "10px" }}
                  onClick={onSubmit}
                  disabled={generatingId}
                >
                  Submit
                </Button>
                <Button
                  disableElevation
                  type="button"
                  variant="contained"
                  color="secondary"
                  fullWidth="false"
                  disabled={isEditing ? false : true}
                  onClick={generateCard}
                >
                  Generate ID
                </Button>
              </ButtonGroup>
            </div>
            <div hidden={!generatingId}>
              <ButtonGroup variant="contained" disableElevation>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={false}
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    exportComponentAsJPEG(componentRef, {
                      fileName: `ID_${employeeItem.empno}.jpg`,
                    });
                    exportComponentAsJPEG(componentBackRef, {
                      fileName: `ID_${employeeItem.empno}_back.jpg`,
                    });
                  }}
                >
                  Download
                </Button>
              </ButtonGroup>
            </div>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
}
