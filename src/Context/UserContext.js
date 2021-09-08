import React, { useEffect, useReducer } from "react";
import userReducer from "./Reducers/userReducer";
import actions from "./Actions";
import axios from "axios";

export const UserContext = React.createContext({ isLoggedIn: false });

const reLoginUser = (user, setLoggedInUser) => {
  let refreshToken = user.refreshToken;
  axios({
    url: `${process.env.REACT_APP_BASE_URL}/users/getAccessToken`,
    method: "POST",
    data: { refreshToken },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => {
      console.log(resp.data);
      setLoggedInUser({ type: actions.LOGIN_USER, payload: resp.data });
    })
    .catch((err) => {
      console.error("Error in logging In", err);

      setLoggedInUser({ type: actions.LOGOUT_USER });
    });
};

const UserContextProvider = (props) => {
  let initialState = JSON.parse(localStorage.getItem("user")) || {
    isLoggedIn: false,
  };

  const [loggedInUser, setLoggedInUser] = useReducer(userReducer, initialState);

  useEffect(() => {
    const localUser = localStorage.getItem("user") || "";
    if (localUser !== "") {
      reLoginUser(loggedInUser, setLoggedInUser);
      setLoggedInUser({
        type: actions.SAVE_NEW_USER,
        payload: JSON.parse(localUser),
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
