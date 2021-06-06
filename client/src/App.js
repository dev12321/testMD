import { useEffect, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "react-apollo";
import { Redirect, Route, Switch } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "./components";
import firebase, { AuthContext } from "./firebase";
import { FETCH_USER_DETAILS, ONBOARD } from "./queries";
import { Admin, Login, Student } from "./pages";
// import AdminHome from "./pages/admin";
// import StudentHome from "./pages/students";
import { ProtectedRoute } from "./utilities";
import { ADMIN, STUDENT } from "./utilities/constants";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";

const Schema = Yup.object().shape({
  fullName: Yup.string().required("Required"),
});
function App() {
  // return <Dashboard />;
  const client = useApolloClient();
  const [currentUser, setCurrentUser] = useState(false);
  const [onboard, { loading: updating }] = useMutation(ONBOARD, {
    onCompleted: () => {
      window.location.reload();
    },
  });

  useEffect(() => {
    // firebase.auth().useEmulator("http://localhost:9099");
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log("user", user);
        const tokenRes = await user.getIdTokenResult();
        const token = await user.getIdToken(true);
        if (tokenRes) {
          localStorage.setItem("token", token);
          client
            .query({
              query: FETCH_USER_DETAILS,
              variables: { email: user.email },
            })
            .then(({ data }) => {
              console.log("data", data);
              if (data.users[0]) {
                setCurrentUser({
                  ...user,
                  ...tokenRes.claims,
                  ...data.users[0],
                });
              } else {
                toast.error(
                  "You are not authorised, Contact the IT department."
                );
                setCurrentUser(null);
              }
            });
        }
      } else {
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  console.log("currentUser", currentUser);
  if (currentUser === false) {
    return (
      <div className="flex min-h-screen w-full justify-center items-center">
        <div className="spinner-grow w-6 h-6 mr-3"></div>
        <p>Please Wait</p>
      </div>
    );
  }

  if (currentUser === null) {
    return (
      <Switch>
        <Route path="/login" exact render={() => <Login />} />
        <Redirect to="/login" />
      </Switch>
    );
  }
  // return <div>Herrllo</div>;
  if (currentUser.onboarded)
    return (
      <AuthContext.Provider value={{ currentUser, firebase }}>
        <Switch>
          <ProtectedRoute
            component={Admin}
            path={"/admin"}
            condition={currentUser.type === ADMIN}
          />
          <ProtectedRoute
            component={Student}
            path={"/student"}
            condition={currentUser.type === STUDENT}
          />
          <Redirect
            to={
              currentUser.type === ADMIN
                ? "/admin/dashboard"
                : "/student/dashboard"
            }
          />
        </Switch>
      </AuthContext.Provider>
    );
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Formik
        validationSchema={Schema}
        validateOnMount={true}
        initialValues={{
          fullName: "",
        }}
        onSubmit={({ fullName }, actions) => {
          onboard({
            variables: { id: currentUser.id, fullName },
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
                  name="fullName"
                  onChange={handleChange}
                  value={values.fullName}
                  placeholder=" "
                  className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-r1"
                />
                <span>Full Name</span>
              </label>
              <ErrorMessage
                component="div"
                className="text-red-600"
                name="fullName"
              />
            </div>

            <div className="flex justify-end items-center gap-3">
              <button
                className="flex items-center justify-center rounded-md  py-2 mt-5 px-5"
                type="submit"
              >
                {updating ? (
                  <>
                    <div className="spinner-grow w-6 h-6"></div>
                    <div>Updating</div>
                  </>
                ) : (
                  <AiOutlineArrowRight className="w-6 h-6" />
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
