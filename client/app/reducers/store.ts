import rootReducer from "./rootReducer";
import {thunk} from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}
// const initialState = {};
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  //RootReducer: persistedReducer,
  // initialState,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export const persistor = persistStore(store)