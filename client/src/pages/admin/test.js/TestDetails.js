import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import Questions from "./Questions";
import * as Yup from "yup";
import { useRouteMatch } from "react-router";
import { useMutation, useQuery } from "react-apollo";
import { GET_TEST, UPDATE_TEST } from "./queries";
import { toast } from "react-toastify";

const Schema = Yup.object().shape({
  title: Yup.string().nullable().required("Required"),
  instructions: Yup.string().nullable().required("Required"),
  duration: Yup.number().nullable().required("Required"),
});
function TestDetails({ step, setStep }) {
  const { params } = useRouteMatch();

  const { loading, data, error } = useQuery(GET_TEST, {
    variables: { id: params.test_id },
  });
  const [updateTest, { loading: updating }] = useMutation(UPDATE_TEST, {
    onCompleted: () => {
      toast.success("Data updated successfully");
      setStep(step + 1);
    },
  });

  if (loading)
    return (
      <div className="flex items-center justify-center w-full mt-12 gap-3">
        <div className="spinner-grow w-6 h-6"></div>
        <div>Loading</div>
      </div>
    );
  return (
    <div class="container px-5 mt-12 mx-auto flex flex-col">
      <Formik
        validationSchema={Schema}
        validateOnMount={true}
        initialValues={{
          title: data?.tests_by_pk?.title || "",
          instructions: data?.tests_by_pk?.instructions || "",
          duration: data?.tests_by_pk?.duration || null,
        }}
        onSubmit={({ title, instructions, duration }, actions) => {
          updateTest({
            variables: {
              id: params.test_id,
              data: { title, instructions, duration },
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
            className="mx-auto w-full lg:w-2/3 xl:w-1/2"
          >
            <div className="mt-5">
              <label className="mui-textfield-outlined w-full">
                <input
                  name="title"
                  onChange={handleChange}
                  value={values.title}
                  placeholder=" "
                  className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-r1"
                />
                <span>Title</span>
              </label>
              <ErrorMessage
                component="div"
                className="text-red-600"
                name="title"
              />
            </div>
            <div className="mt-5">
              <label className="mui-textfield-outlined w-full">
                <input
                  name="duration"
                  type="number"
                  onChange={handleChange}
                  value={values.duration}
                  placeholder=" "
                  className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-r1"
                />
                <span>Duration (in minutes)</span>
              </label>
              <ErrorMessage
                component="div"
                className="text-red-600"
                name="duration"
              />
            </div>
            <div className="mt-5">
              <label className="mui-textfield-outlined w-full">
                <textarea
                  name="instructions"
                  rows={8}
                  onChange={handleChange}
                  value={values.instructions}
                  placeholder=" "
                  className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-r1"
                />
                <span>Instructions</span>
              </label>
              <ErrorMessage
                component="div"
                className="text-red-600"
                name="instructions"
              />
            </div>
            <div className="flex justify-end items-center gap-3">
              <button
                className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mt-12 px-5"
                type="submit"
              >
                {updating ? (
                  <>
                    <div className="spinner-grow w-6 h-6"></div>
                    <div>Updating</div>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
              {!dirty && errors && Object.keys(errors).length === 0 ? (
                <button
                  className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mt-12 px-5"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep(step + 1);
                  }}
                >
                  Next
                </button>
              ) : null}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TestDetails;
