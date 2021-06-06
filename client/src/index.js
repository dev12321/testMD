import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import Apollo from "./apollo";
import App from "./App";
// import { AuthContextProvider } from "./components/authModal";
import "./index.css";
import { SkeletonTheme } from "react-loading-skeleton";
import reportWebVitals from "./reportWebVitals";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ApolloProvider } from "react-apollo";
import client from "./apollo";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <AuthContextProvider> */}

      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
      <ToastContainer
        // bodyClassName="rounded-md"
        // className="rounded-md"
        toastClassName="rounded-md px-5"
      />
      {/* </AuthContextProvider> */}
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// {
//     "https://hasura.io/jwt/claims": {
//     "x-hasura-allowed-roles": ["student", "manager"],
//     "x-hasura-default-role": "student",
//     "x-hasura-user-id": "8b19fe8c-65da-44b8-a5f2-2eebed069553"
//   }
// }
