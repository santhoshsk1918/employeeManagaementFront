import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { EmployeeContext } from "../../Context/EmployeeContext";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
    cardContainer: {
      padding: "10px"
    },
    searchContent: {
      paddingLeft: "20px",
      [theme.breakpoints.down("xs")]: {
        paddingLeft: "0px",
      },
    }
  };
});

export default function DashBoard() {
  const classes = useStyles();
  const { employeeData } = useContext(EmployeeContext);
  const employeeList = employeeData ? employeeData.employeeList : [];
  const [filteredEmployee, setFilteredEmployee] = useState(employeeData.employeeList);

  const onChangeText = (event) => {
    let value = event.target.value;
    let newList = employeeList.filter(item => item.name.toLowerCase().includes(value ? value.toLowerCase() : ""));
    setFilteredEmployee(newList);
  }

  useEffect(() => {
    function setList() {
      setFilteredEmployee(employeeData ? employeeData.employeeList : []);
    }
    setList();
  }, [employeeData])

  return (
    <>
      <Grid container className={classes.content}>
        <Grid item={true} direction={"row"}>
          <Typography variant={"h5"} component={"h1"} color="secondary">
            Dashboard <Link href="/addemployee" color="secondary"><AddCircleOutlineIcon /></Link>
          </Typography>
        </Grid>
        <Grid item direction={"row"}>
          <TextField variant="standard" className={classes.searchContent} placeholder="Search Employee Name" style={{width: "250px"}} onChange={onChangeText}></TextField>
        </Grid>
      </Grid>
      <Grid container item alignItems={"center"} className={classes.content}>
        {filteredEmployee.length > 0 ? (
          filteredEmployee.map((item) => (
            <Grid item xs={12} md={3} style={{margin: "5px"}}>
              <Card variant="outlined" className={classes.cardContainer}>
                <Typography variant="subtitle2">{item.empno}</Typography>
                <Typography variant="h6" color="textPrimary">
                  {item.name}
                </Typography>
                <Typography variant="caption" color="textPrimary">
                  {item.designation}
                </Typography>
                <br />
                <Typography variant="caption" color="textPrimary">
                  {item.dob}
                </Typography>
                <br />
                <Typography variant="caption">{item.branch}</Typography>
                <CardActions>
                  <Button
                    color="primary"
                    size="small"
                    href={`addemployee/${item._id}`}
                    style={{ paddingLeft: "0px" }}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h5">No Employee</Typography>
        )}
      </Grid>
    </>
  );
}
