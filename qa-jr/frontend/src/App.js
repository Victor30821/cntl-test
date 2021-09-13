import React from "react";
import Router from "./Router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./store/";
import { resetStyle, device } from "./assets/global.js";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";

const GlobalStyle = createGlobalStyle`
  ${resetStyle}
  /* other styles */
`;

export default function App() {
  return (
    <ThemeProvider theme={{ device }}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GlobalStyle />
            <Router />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              draggable
            />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
