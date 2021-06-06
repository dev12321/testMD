import React from "react";
import { Route, Switch } from "react-router";
import { Header } from "../../components";
import Dashboard from "./dashboard";
import Test from "./test.js";

function Admin() {
  return (
    <>
      <Header />
      <Switch>
        <Route
          path="/admin/dashboard"
          render={(routeProps) => <Dashboard {...routeProps} />}
        />
        <Route
          path="/admin/test/:test_id"
          render={(routeProps) => <Test {...routeProps} />}
        />
      </Switch>
    </>
  );
}

export default Admin;
