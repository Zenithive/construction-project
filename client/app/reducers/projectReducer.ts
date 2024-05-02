import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
//import {USER_ACTIONS} from "./actions/user.actions";

export interface ProjectSchema {
  projId: string;
  projName: string;
}
export interface ProjectState {
  project: Array<ProjectSchema>; // Define the structure of your user object
}

const initialState: ProjectState = {
  project: [],
}

export const projectSliece = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addproject: (state, action: PayloadAction<Array<ProjectSchema>>) => {
      state.project = action.payload;
    },
    removeproject: (state, action: PayloadAction<ProjectSchema>) => {

      const projIdToRemove = action.payload;

      state.project = state.project.filter(obj => obj.projId !== projIdToRemove.projId);
    }
  }
});

export const { addproject, removeproject } = projectSliece.actions;

export default projectSliece.reducer;