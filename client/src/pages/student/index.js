import React from "react";
import { Route, Switch } from "react-router";
import { Header } from "../../components";
import Dashboard from "./dashboard";
import Test from "./test";

function Student() {
  return (
    <>
      <Switch>
        <Route
          path="/student/dashboard"
          render={(routeProps) => <Dashboard {...routeProps} />}
        />
        <Route
          path="/student/test/:attempt_id"
          render={(routeProps) => <Test {...routeProps} />}
        />
      </Switch>
    </>
  );
}

export default Student;
