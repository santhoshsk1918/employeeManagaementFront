import actions from "../Actions";

const userReducer = (state, action) => {
  switch (action.type) {
    case actions.RESET_EMPLOYEE_LIST:
      let payload = action.payload;
      localStorage.setItem("employee", JSON.stringify(payload.employeeList));
      localStorage.setItem(
        "designation",
        JSON.stringify(payload.designationList)
      );
      localStorage.setItem("branch", JSON.stringify(payload.branchList));
      return payload;

    case actions.SET_EMPLOYEE_LIST:
      let employeeList = action.payload;
      localStorage.setItem("employee", JSON.stringify(employeeList));
      return { ...state, employeeList };

    case actions.SET_DESIGNATION_LIST:
      let designationList = action.payload;
      localStorage.setItem("designation", JSON.stringify(designationList));
      return { ...state, designationList };

    case actions.SET_BRANCH_LIST:
      let branchList = action.payload;
      localStorage.setItem("branch", JSON.stringify(branchList));
      return { ...state, branchList };

    default:
      return state;
  }
};

export default userReducer;
