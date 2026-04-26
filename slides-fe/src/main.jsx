import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import Loader from "./components/common/loader/loader.spinner";

import "react-toastify/dist/ReactToastify.css";
import "./assets/global.css";
import AppRoutes from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Suspense
              fallback={
                <Loader size={32} role="status" className="spinner-border" />
              }
            >
              <App />
            </Suspense>
         
            <ToastContainer hideProgressBar theme="colored" autoClose={false} />
          </BrowserRouter>
          {/* <ReactQueryDevtools/> */}
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
