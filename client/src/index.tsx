import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "./client/client"

const container = document.getElementById("root")!;
const root = createRoot(container);


root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider> 
  </React.StrictMode>
);

reportWebVitals();
