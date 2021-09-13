import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: "contelerastreador",
      storage: storage,
      whitelist: ["auth", "menu", "organization", "preferences", "general"]
    },
    reducers
  );

  return persistedReducer;
};
