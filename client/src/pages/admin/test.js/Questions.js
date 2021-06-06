import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { useRouteMatch } from "react-router";
import { GET_QUESTIONS } from "./queries";
import QuestionCard from "./QuestionCard";

function Questions({ step, setStep }) {
  const { params } = useRouteMatch();

  const [add, setAdd] = useState(false);
  const { data, loading, error } = useQuery(GET_QUESTIONS, {
    variables: { test_id: params.test_id },
  });
  if (loading)
    return (
      <div className="flex items-center justify-center w-full mt-12 gap-3">
        <div className="spinner-grow w-6 h-6"></div>
        <div>Loading</div>
      </div>
    );
  return (
    <div class="container py-5 px-5 mt-12 mx-auto flex flex-col">
      {data?.questions?.length > 0 ? (
        <div className="flex justify-center">
          <button
            className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mb-5 px-5"
            onClick={(e) => {
              e.preventDefault();
              setStep(step + 1);
            }}
          >
            Next
          </button>
        </div>
      ) : null}
      {data?.questions?.map((question) => {
        return <QuestionCard question={question} />;
      })}
      {add ? (
        <QuestionCard
          close={() => {
            setAdd(false);
          }}
        />
      ) : null}
      <button
        className="p-5 flex items-center justify-center border-2 border-dashed border-blue-600 font-medium rounded-md"
        onClick={() => {
          setAdd(true);
        }}
      >
        Add Questions
      </button>
    </div>
  );
}

export default Questions;
