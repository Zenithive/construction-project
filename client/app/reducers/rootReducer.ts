import { combineReducers } from "redux";

import userReducer from "./userReducer";
import moduleReducer from "./moduleReducer";
import projectReducer from "./projectReducer";

const rootReducer = combineReducers({
    user: userReducer,
    module: moduleReducer,
    project: projectReducer,
});
export default rootReducer;