import React from "react";
import { useEffect } from "react";
import { useQuery } from "react-apollo";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { toast } from "react-toastify";
import { GET_TEST_INFO } from "./queries";
import TestInfo from "./test_info";
import TestMain from "./test_main";

function Test() {
  const { params } = useRouteMatch();
  const { data, loading, error } = useQuery(GET_TEST_INFO, {
    variables: {
      id: params.attempt_id,
    },
  });
  useEffect(() => {
    if (data?.attempts_by_pk?.status === "complete") {
      toast.success("You have already completed this test");
    }
  }, [data]);
  if (loading) {
    return (
      <div className="flex min-h-screen w-full justify-center items-center">
        <div className="spinner-grow w-6 h-6 mr-3"></div>
        <p>Please Wait</p>
      </div>
    );
  }
  switch (data.attempts_by_pk.status) {
    case "NA":
      return <TestInfo loading={loading} data={data} />;
    case "inprogress":
      return <TestMain />;
    case "complete":
      return <Redirect to="/" />;
    default:
      return <div>Error</div>;
  }
}

export default Test;
