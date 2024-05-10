import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {USER_ACTIONS} from "./actions/user.actions";


export interface ProjectSchema {
  projId: string;
  projName: string;
  userId:string;
}
export interface ProjectState {
  project: Array<ProjectSchema>; 
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
  
      if (Array.isArray(state.project)) {
          state.project = state.project.filter(obj => obj.projId !== projIdToRemove.projId || obj.userId !== projIdToRemove.userId);
      } else {
          console.error('State project is not an array');
      }
  },
  },
});


export const { addproject, removeproject } = projectSliece.actions;

export default projectSliece.reducer;