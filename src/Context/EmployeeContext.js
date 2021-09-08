import React, { useContext, useEffect, useReducer } from "react";
import employeeReducer from "./Reducers/employeeReducer";
import actions from "./Actions";
import axios from "axios";
import { UserContext } from "./UserContext";

export const EmployeeContext = React.createContext({
  employeeList: [],
  designationList: [],
  branchList: [],
});

const EmployeeContextProvider = (props) => {
  const { loggedInUser } = useContext(UserContext);

  let employeeList = [];
  let designationList = [];
  let branchList = [];

  let initialState = {
    employeeList,
    designationList,
    branchList,
  };

  const [employeeData, setEmployeeData] = useReducer(
    employeeReducer,
    initialState
  );

  const getEmployeeList = async (setData) => {
    try {
      let response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/employee/getEmployeeList`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      });
      if (setData) {
        setEmployeeData({
          type: actions.SET_EMPLOYEE_LIST,
          payload: response.data ,
        });
      }
      console.log(response.data);
      return response.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getDesignationList = async (setData = false) => {
    try {
      let response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/employee/getDesignationList`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      });
      console.log(response.data, "Getting Response");
      if (setData) {
        setEmployeeData({
          type: actions.SET_DESIGNATION_LIST,
          payload: response.data,
        });
      }
      return response.data || null;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getBranchList = async (setData = false) => {
    try {
      let response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/employee/getBranchList`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      });
      if (setData) {
        setEmployeeData({
          type: actions.SET_BRANCH_LIST,
          payload: response.data,
        });
      }
      return response.data || null;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const resetEmployeeData = async (forceReset = false) => {
    let localEmployeeList = localStorage.getItem("employee") || "[]";
    let localDesignationList = localStorage.getItem("designation") || "[]";
    let localBranchList = localStorage.getItem("branch") || "[]";
    if (forceReset) {
      employeeList = (await getEmployeeList()) || [];
      designationList = (await getDesignationList()) || [];
      branchList = (await getBranchList()) || [];
    } else {
      employeeList =
        JSON.parse(localEmployeeList).length !== 0
          ? JSON.parse(localEmployeeList)
          : loggedInUser
          ? (await getEmployeeList()) || []
          : [];
      designationList =
        JSON.parse(localDesignationList).length !== 0
          ? JSON.parse(localDesignationList)
          : loggedInUser
          ? (await getDesignationList()) || []
          : [];
      branchList =
        JSON.parse(localBranchList).length !== 0
          ? JSON.parse(localBranchList)
          : loggedInUser
          ? (await getBranchList()) || []
          : [];
    }
    setEmployeeData({
      type: actions.RESET_EMPLOYEEDATA,
      payload: { employeeList, designationList, branchList },
    });
  };

  useEffect(() => {
    resetEmployeeData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        employeeData,
        setEmployeeData,
        getEmployeeList,
        getDesignationList,
        getBranchList,
      }}
    >
      {props.children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContextProvider;
