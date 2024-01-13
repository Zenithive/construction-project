import { combineReducers } from "redux";

import userReducer from "./userReducer";
import moduleReducer from "./moduleReducer";

const rootReducer = combineReducers({
    user: userReducer,
    module: moduleReducer
});
export default rootReducer;