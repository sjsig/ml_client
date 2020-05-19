import { SET_CURRENT_USER } from "../actionTypes";

const DEFAULT_STATE = {
  isAuthenticated: false, //hopefully true when logged in
  user: { isAdmin: false }, //all the user infor when logged in
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      console.log("Current user:", action.user);
      return {
        isAuthenticated: Object.keys(action.user).length > 0 ? true : false, //there are user keys, not undefined
        user: action.user,
      };
    default:
      return state;
  }
};
