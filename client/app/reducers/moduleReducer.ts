import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
//import {USER_ACTIONS} from "./actions/user.actions";

const initialState = {
  name: "CDE"
}

export const moduleSliece = createSlice({
  name: 'module',
  initialState,
  reducers: {
    addModule: (state, action) => {
      state.name = action.payload;
    },
    removeModule: (state) => {
      state.name = "";
    },
  }
});

export const { addModule, removeModule } = moduleSliece.actions;
export const selectModule = (state: RootState) => state.module.name;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const userReducer = (state = initial_state, action: { type: any; payload: any; } ) => {
//   switch (action.type) {
//       case USER_ACTIONS.SET_USER:
//           return { ...action.payload };
//       default:
//           return state;
//   }
// }

export default moduleSliece.reducer;