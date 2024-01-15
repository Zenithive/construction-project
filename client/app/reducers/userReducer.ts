import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
//import {USER_ACTIONS} from "./actions/user.actions";

interface UserState {
  user: { token : string }; // Define the structure of your user object
}

const initialState: UserState = {
  user: {
    token: "",
  }
}

export const userSliece = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<{ token: string }>) => {
      const newObj = action.payload;
      state.user = { ...state.user , ...newObj};
    },
    removeUser: (state) => {
      state.user = { token: "" };
    },
  }
});

export const { addUser, removeUser } = userSliece.actions;

export const selectUserSession = (state: RootState) => state.user.user;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const userReducer = (state = initial_state, action: { type: any; payload: any; } ) => {
//   switch (action.type) {
//       case USER_ACTIONS.SET_USER:
//           return { ...action.payload };
//       default:
//           return state;
//   }
// }

export default userSliece.reducer;