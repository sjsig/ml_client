import { apiCall, setTokenHeader } from "../../services/api";
import { SET_CURRENT_USER } from "../actionTypes";
import { addError, removeError } from "./error";
import jwtDecode from "jwt-decode";

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  };
}

export function setAuthorizationToken(token) {
  setTokenHeader(token);
}

//sets an empty current user
export function logout() {
  return (dispatch) => {
    localStorage.clear();
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}
//type is "signin" or "signup";
export function authUser(type, userData) {
  return (dispatch) => {
    //wrap our thunk in a promise so that we can wait for the API call
    return new Promise((resolve, reject) => {
      return apiCall("post", `/api/auth/${type}`, userData) //post has to be lowercase, idk why probably something to do with axios
        .then(({ token, ...user }) => {
          localStorage.setItem("jwtToken", token);
          setAuthorizationToken(token);
          dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
          dispatch(removeError());
          resolve(); //indicate that the API call succeeded
        })
        .catch((err) => {
          dispatch(addError(err.message)); //message property is coming from server in error object
          reject(); //indicate that the API call failed
        });
    });
  };
}
