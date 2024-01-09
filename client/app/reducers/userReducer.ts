import {USER_ACTIONS} from "./actions/user.actions";

const initial_state = {
  user: {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userReducer = (state = initial_state, action: { type: any; payload: any; } ) => {
  switch (action.type) {
      case USER_ACTIONS.SET_USER:
          return { ...action.payload };
      default:
          return state;
  }
}

export default userReducer;