import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import { MdDelete } from "react-icons/md";
import { useRouteMatch } from "react-router";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { DELETE_QUESTION, GET_QUESTIONS, INSERT_QUESTION } from "./queries";

const Schema = Yup.lazy((values) => {
  return Yup.object().shape({
    title: Yup.string().nullable().required("Required"),
    options: Yup.array()
      .nullable()
      .required("Required")
      .of(Yup.string().nullable().required("Required")),
    answer: Yup.number()
      .nullable()
      .required("You have to select an answer")
      .min(1, "Invalid answer value")
      .max(values.options.length, "Invalid answer value"),
  });
});
function QuestionCard({ question, close }) {
  const [isEdit, setIsEdit] = useState(!question);
  const { params } = useRouteMatch();
  const [addQuestion, { loading: adding }] = useMutation(INSERT_QUESTION, {
    onCompleted: () => {
      toast.success("Operation Successful");
      if (typeof close === "function") {
        close();
      }
    },
    update: (cache, { data: { insert_questions_one } }) => {
      if (insert_questions_one) {
        console.log("insert_questions_one", insert_questions_one);
        try {
          const query = GET_QUESTIONS;
          const data = cache.readQuery({
            query,
            variables: {
              test_id: params.test_id,
            },
          });
          const index = data.questions.findIndex(
            (el) => el.id === insert_questions_one.id
          );
          if (index > 0) {
            data.questions = data.questions.map((_, i) =>
              i === index ? insert_questions_one : _
            );
          } else {
            data.questions = [
              ...data.questions,
              { ...insert_questions_one, __typename: "questions" },
            ];
          }

          console.log("data", data);
          cache.writeQuery({
            query,
            variables: {
              test_id: params.test_id,
            },
            data,
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    },
  });
  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    update: (cache, { data: { delete_questions_by_pk } }) => {
      if (delete_questions_by_pk) {
        try {
          const query = GET_QUESTIONS;
          const data = cache.readQuery({
            query,
            variables: {
              test_id: params.test_id,
            },
          });

          console.log("data", data);
          cache.writeQuery({
            query,
            variables: {
              test_id: params.test_id,
            },
            data: {
              questions: data.questions.filter(
                (el) => el.id !== delete_questions_by_pk.id
              ),
            },
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    },
  });
  //   useEffect(() => {

  //   }, [question])
  if (isEdit)
    return (
      <Formik
        validationSchema={Schema}
        validateOnChange={false}
        validateOnBlur={true}
        initialValues={{ title: "", options: [], answer: "" }}
        onSubmit={(values, actions) => {
          addQuestion({
            variables: {
              object: {
                ...values,
                test_id: params.test_id,
                ...(question ? { id: question.id } : {}),
              },
            },
          });
        }}
      >
        {({
          handleSubmit,
          values,
          errors,
          handleChange,
          setFieldValue,
          dirty,
        }) => (
          <Form
            onSubmit={handleSubmit}
            className="border rounded-md p-5 shadow my-2"
          >
            <div className="mt-5">
              <label className="mui-textfield-outlined w-full">
                <textarea
                  name="title"
                  rows={2}
                  onChange={handleChange}
                  value={values.title}
                  placeholder=" "
                  className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-600"
                />
                <span>Question</span>
              </label>
              <ErrorMessage
                component="div"
                className="text-red-600"
                name="title"
              />
            </div>
            <FieldArray
              name="options"
              render={({ push, remove }) => (
                <div className="grid grid-cols-2 gap-5">
                  {values.options.map((option, index) => {
                    return (
                      <div
                        className={`p-5 flex items-center justify-between ${
                          values.answer === index + 1
                            ? "bg-blue-400"
                            : "bg-white border border-blue-600"
                        } font-medium rounded-md gap-3`}
                      >
                        <div className="flex gap-3 items-center w-full">
                          <button
                            className={`w-6 h-6 rounded-full ${
                              values.answer === index + 1
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              setFieldValue("answer", index + 1);
                            }}
                          />
                          <div className="w-full">
                            <textarea
                              value={option}
                              rows={2}
                              name={`options[${index}]`}
                              onChange={handleChange}
                              className={`focus:outline-none p-2 rounded-md w-full ${
                                values.answer === index + 1
                                  ? "text-white bg-blue-500"
                                  : "text-black border"
                              }`}
                            />
                            <ErrorMessage
                              component="div"
                              className="text-red-600"
                              name={`options[${index}]`}
                            />
                          </div>
                        </div>
                        <button
                          className={``}
                          onClick={(e) => {
                            e.preventDefault();
                            remove(index);
                          }}
                        >
                          <MdDelete className="w-6 h-6 text-red-600" />
                        </button>
                      </div>
                    );
                  })}
                  <ErrorMessage
                    component="div"
                    className="text-red-600 col-span-2 text-center"
                    name="answer"
                  />
                  <button
                    className="p-5 flex items-center justify-center border-2 border-dashed border-blue-600 font-medium rounded-md"
                    onClick={(e) => {
                      e.preventDefault();
                      push("");
                    }}
                  >
                    Add Questions
                  </button>
                </div>
              )}
            />

            <div className="flex justify-end gap-3">
              <button
                className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mt-12 px-5"
                type="submit"
              >
                {adding ? (
                  <>
                    <div className="spinner-grow w-6 h-6"></div>
                    <div>{question ? "Updating" : "Adding"}</div>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                className="flex items-center justify-center rounded-md bg-red-600 text-white py-2 mt-12 px-5"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    !dirty ||
                    (dirty &&
                      window.confirm(
                        "You have not saved your changes. Continue?"
                      ))
                  ) {
                    if (typeof close === "function") {
                      close();
                    } else {
                      setIsEdit(false);
                    }
                  }
                }}
              >
                <div className="font-semibold text-sm">Cancel</div>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  if (question)
    return (
      <div className="border rounded-md p-5 shadow my-2">
        <div className="w-full flex gap-3 items-start">
          <div
            name="title"
            placeholder=" "
            className="p-3 w-full bg-white focus:shadow-none border-gray-400 focus:border-blue-600 text-lg font-medium"
          >
            {question.title}
          </div>
          <button
            className={``}
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm("Are you sure you want to delete?"))
                deleteQuestion({ variables: { id: question.id } });
            }}
          >
            <MdDelete className="w-6 h-6 text-red-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {question.options.map((option, index) => {
            return (
              <div
                className={`p-5 flex items-center justify-between ${
                  question.answer === index + 1
                    ? "bg-blue-400"
                    : "bg-white border border-blue-600"
                } font-medium rounded-md gap-3`}
              >
                <div className="flex gap-3 items-center w-full">
                  <button
                    className={`w-6 h-6 rounded-full ${
                      question.answer === index + 1
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  />
                  <div className="w-full">
                    <div
                      className={`focus:outline-none p-2 rounded-md w-full ${
                        question.answer === index + 1
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {option}
                    </div>
                  </div>
                </div>
                <button
                  className={``}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                ></button>
              </div>
            );
          })}
        </div>
      </div>
    );
  return null;
}

export default QuestionCard;
