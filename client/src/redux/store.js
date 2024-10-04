import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice/userSlice";
import themeReducer from "./theme/themeSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// 1- Create a root reducer:
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

// 2- configure store
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};
// 3- create persistedReducer and us it in store:
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4- Create a store with persisted reducer:
export const store = configureStore({
  reducer: persistedReducer,
  // MiddleWare to prevent default error in redux:
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// 5- redux-persist uses to store data in local storage.
