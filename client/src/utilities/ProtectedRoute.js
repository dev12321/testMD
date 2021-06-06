import React, { useContext, useEffect } from "react";
import { Redirect, Route, useRouteMatch } from "react-router-dom";
import { AuthContext } from "./../firebase";
import { toast } from "react-toastify";

const ProtectedRoute = ({
  condition = null,
  component: RouteComponent,
  ...rest
}) => {
  const { currentUser } = useContext(AuthContext);
  const { url } = useRouteMatch();
  useEffect(() => {
    if (condition === false) {
      toast.error("You are not authorized");
    }
    if (!currentUser) {
      toast.error("You have to login first");
    }
  }, []);
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        currentUser && condition !== false ? (
          <RouteComponent {...routeProps} {...rest} />
        ) : (
          <Redirect to={"/"} />
        )
      }
    />
  );
};

export default ProtectedRoute;
