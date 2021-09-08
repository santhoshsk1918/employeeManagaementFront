import actions from "../Actions";

const userReducer = (state, action) => {
    switch (action.type) {
        case actions.GET_USER:
            return state;
        case actions.SAVE_NEW_USER:
            return state;
        case actions.LOGIN_USER:
            let user = action.payload;
            localStorage.setItem("user", JSON.stringify({...user, isLoggedIn: true}))
            return {...state, ...user, isLoggedIn: true}
        case actions.LOGOUT_USER:
            localStorage.clear();
            return {isLoggedIn: false}
        default:
            return state
    }
}

export default userReducer;