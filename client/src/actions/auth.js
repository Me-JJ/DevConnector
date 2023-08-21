import api from "../utils/api";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";
import { setAlert } from "./alert";

//load user
export const loadUser = () => async (dispatch) => {
  // console.log(localStorage);
  try {
    const res = await api.get("http://localhost:5050/api/auth");
    // console.log("res->data=>", res.data);
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//register user
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    const body = {
      name,
      email,
      password,
    };
    try {
      //   console.log("body->", body);
      const res = await api.post(
        "http://localhost:5050/api/users",
        body,
        config
      );
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      //   console.log("err->", err);
      const errors = err.response.data.error;
      //   console.log("errors->", errors);
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert(error.msg, "danger"));
        });
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

//Login user
export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    const body = {
      email,
      password,
    };
    try {
      // console.log("body->", body);
      const res = await api.post(
        "http://localhost:5050/api/auth",
        body,
        config
      );
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      // console.log("err->", err);
      const errors = err.response.data.errors;
      // console.log("errors->", errors);
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert(error.msg, "danger"));
        });
      }
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };

//LOGOUT ? clear profiles
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
