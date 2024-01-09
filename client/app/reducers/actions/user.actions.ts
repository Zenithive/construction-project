import { Dispatch } from "redux";

export const USER_ACTIONS = {
  SET_USER: "SET_USER",
  FAILED_TO_SET_USER: "FAILED_TO_SET_USER",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setUser = (payload: any) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: USER_ACTIONS.SET_USER,
        payload: payload
      });
    } catch (err) {
      dispatch({
        type: USER_ACTIONS.FAILED_TO_SET_USER,
        payload: null
      });
    }
  }
};

export const userActions = {
  setUser
}