import React, { useEffect, useMemo, useState } from "react";
import {
  MdClose,
  MdHome,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import Countdown from "react-countdown";
import { addMinutes, intervalToDuration, isWithinInterval } from "date-fns";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import { useRouteMatch } from "react-router";
import { useMutation, useQuery } from "react-apollo";
import {
  GET_FULL_TEST_AND_ATTEMPT_DATA,
  SUBMIT_ANSWER,
  SUBMIT,
  ADD_LOG,
} from "./queries";
import { useRef } from "react";
import { motion } from "framer-motion";
import WebCamStreaming from "./WebcamStreamHandler";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const UserWebcamVideo = ({
  cameraStream,
  captureSnapshot,
  sleep,
  recordAudio,
  videoRef,
  constraintsRef,
}) => {
  const { params } = useRouteMatch();
  const [error, setError] = useState(false);
  const [timerIndex, setTimerIndex] = useState(true);
  const [addLog] = useMutation(ADD_LOG);
  const timerFnc = (t) =>
    setTimeout(async () => {
      let uploadImageForm = new FormData();
      // uploadImageForm.append("file", {
      //   type: "image/jpg",
      //   uri: snap.url,
      //   name: `${params.attempt_id}.jpeg`,
      // });
      captureSnapshot().then((snap) => {
        uploadImageForm.append("file", snap.blob, `${params.attempt_id}.jpg`);
        uploadImageForm.append("id", params.attempt_id);
        // fetch("http://localhost:5002/register", {
        //   method: "POST",
        //   headers: { "Content-Type": "multipart/form-data" },
        //   body: uploadImageForm,
        // })
        //   .then((response) => response.json())
        axios({
          method: "post",
          url: "http://localhost:5002/verify",
          data: uploadImageForm,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((response) => {
            console.log(response.data);

            if (response.data.state === "verified") {
              setError(false);
            } else {
              if (!error) {
                toast.error("Error: " + response.data.error);
              }
              addLog({
                variables: {
                  id: params.attempt_id,
                  object: {
                    type: "face",
                    desc: response.data.error,
                    attempt_id: params.attempt_id,
                  },
                },
              });
              setError(true);
            }
          })
          .catch(() => {
            toast.error("Error on Network");
            setError(true);
          })
          .finally(() => {
            setTimerIndex((w) => !w);
          });
      });
    }, t);
  useEffect(() => {
    const timer = timerFnc(Math.random() * 3000 + 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [timerIndex]);
  return (
    <motion.video
      ref={videoRef}
      // src={cameraStream}
      autoPlay={true}
      muted={true}
      drag
      dragConstraints={constraintsRef}
      className={`w-56 h-56 rounded-full fixed z-50 m-16 bottom-0 right-0 object-cover border-4 border-opacity-50 ${
        error ? "border-red-600" : "border-green-600"
      }`}
    ></motion.video>
  );
};
function TestMain() {
  const [addLog] = useMutation(ADD_LOG);
  const [submitTest] = useMutation(SUBMIT, {
    update: (cache, { data: { update_attempts_by_pk } }) => {
      if (update_attempts_by_pk) {
        try {
          const cdata = cache.readQuery({
            query: GET_FULL_TEST_AND_ATTEMPT_DATA,
            variables: { id: params.attempt_id },
          });
          cdata.attempts_by_pk.status = update_attempts_by_pk.status;
          console.log("cdata", cdata);
          cache.writeQuery({
            query: GET_FULL_TEST_AND_ATTEMPT_DATA,
            variables: { id: params.attempt_id },
            data: { ...cdata },
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    },
  });
  const constraintsRef = useRef(null);
  const { params } = useRouteMatch();
  const { data, loading, error } = useQuery(GET_FULL_TEST_AND_ATTEMPT_DATA, {
    variables: { id: params.attempt_id },
  });
  console.log("data", data);
  const [submit, { loading: submitting }] = useMutation(SUBMIT_ANSWER, {
    update: (cache, { data: { insert_submissions_one } }) => {
      if (insert_submissions_one) {
        try {
          const cdata = cache.readQuery({
            query: GET_FULL_TEST_AND_ATTEMPT_DATA,
            variables: { id: params.attempt_id },
          });
          cdata.attempts_by_pk.test.questions =
            cdata.attempts_by_pk.test.questions.map((question) => {
              if (question.id === insert_submissions_one.question_id)
                return {
                  ...question,
                  submissions: [insert_submissions_one],
                };
              return question;
            });
          cache.writeQuery({
            query: GET_FULL_TEST_AND_ATTEMPT_DATA,
            variables: { id: params.attempt_id },
            data: { ...cdata },
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    },
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const tabChangeHandler = function () {
      if (!document.hidden) {
        addLog({
          variables: {
            id: params.attempt_id,
            object: {
              type: "tab_switch",
              desc: "User Switched the tab",
              attempt_id: params.attempt_id,
            },
          },
        });
        toast.error("You should not switch tabs while giving the test.");
      }
    };
    document.addEventListener("visibilitychange", tabChangeHandler);
    return () => {
      document.removeEventListener("visibilitychange", tabChangeHandler);
    };
  }, []);
  //   useEffect(async () => {
  //     const stream = await navigator.mediaDevices.getUserMedia();
  //   }, []);
  if (loading) {
    return (
      <div className="flex min-h-screen w-full justify-center items-center">
        <div className="spinner-grow w-6 h-6 mr-3"></div>
        <p>Please Wait</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-between h-screen">
      <WebCamStreaming>
        {({ cameraStream, captureSnapshot, sleep, recordAudio, videoRef }) => {
          return (
            <UserWebcamVideo
              {...{
                cameraStream,
                captureSnapshot,
                sleep,
                recordAudio,
                videoRef,
                constraintsRef,
              }}
            />
          );
        }}
      </WebCamStreaming>

      {submitting ? (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex w-full justify-center items-center z-50">
          <div className="animate-spin flex items-center justify-center">
            <CgSpinnerTwo className=" w-8 h-8" />
          </div>
        </div>
      ) : null}

      <div className="fixed right-0 top-0 text-center mx-auto p-3 bg-gray-100 rounded-bl-md flex flex-col gap-2">
        <div> Time remaining</div>
        <div>
          <Countdown
            autoStart={true}
            daysInHours={true}
            // onTick={({ total }) => {
            //   console.log("total", total);
            // }}
            renderer={({ completed, formatted }) => {
              const { days, hours, minutes, seconds } =
                data.attempts_by_pk.status === "complete"
                  ? {
                      days: "00",
                      hours: "00",
                      minutes: "00",
                      seconds: "00",
                    }
                  : formatted;
              if (completed) {
                return (
                  <div className="w-full flex justify-center items-center">
                    <div className="text-lg">Test Over</div>
                  </div>
                );
              }
              return (
                <div className="flex justify-end">
                  <div className="flex gap-2 text-lg">
                    <div>{hours}</div>
                    <div>:</div>
                    <div>{minutes}</div>
                    <div>:</div>
                    <div>{seconds}</div>
                  </div>
                </div>
              );
            }}
            date={
              addMinutes(
                new Date(data.attempts_by_pk.start_at),
                data.attempts_by_pk.test.duration
              )
              // addSeconds(new Date(), 10)
            }
            onMount={({ completed }) => {
              if (completed) {
                submitTest({
                  variables: {
                    id: params.attempt_id,
                  },
                });
                console.log("completed");
              }
            }}
            onComplete={() => {
              console.log("On comleted");
              submitTest({
                variables: {
                  id: params.attempt_id,
                },
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-grow relative" ref={constraintsRef}>
        <div
          className={`w-full sm:w-96 border-r shadow-md ${
            menuOpen ? "" : "-translate-x-full"
          } transform transition-all duration-100 ease-linear p-8 flex flex-col bg-gray-50 absolute left-0 inset-y-0 overflow-y-auto`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between gap-3 mb-5 items-center">
              <Link to="/" className="">
                <MdHome className="w-8 h-8 text-gray-400" />
              </Link>
              <div>
                <button
                  className="bg-red-600 border-red-600 bg-opacity-25 border py-2 px-5 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      window.confirm("Are you sure you want to end the test?")
                    )
                      submitTest({
                        variables: {
                          id: params.attempt_id,
                        },
                      });
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
            {data.attempts_by_pk.test.questions.map((question, index) => {
              return (
                <button
                  className={` px-3 py-2 rounded-md ${
                    index === currentQuestion
                      ? "bg-gray-300"
                      : question.submissions[0]
                      ? "bg-green-600 bg-opacity-25"
                      : "border-gray-300 border"
                  } hover:bg-black hover:bg-opacity-25 cursor-pointer`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentQuestion(index);
                  }}
                >{`Question ${index + 1}`}</button>
              );
            })}
          </div>
        </div>
        <div className="max-w-screen-lg w-full mx-auto py-5 px-12 flex flex-col ">
          <div className="mt-16">
            <div className="text-lg font-medium">{`Question ${
              currentQuestion + 1
            }`}</div>
            <div className="text-3xl">
              {data.attempts_by_pk.test.questions[currentQuestion].title}
            </div>
            <div className="grid md:grid-cols-2 gap-5 mt-16">
              {data.attempts_by_pk.test.questions[currentQuestion].options.map(
                (option, index) => {
                  return (
                    <button
                      className={`p-5 flex items-center justify-between ${
                        data.attempts_by_pk.test.questions[currentQuestion]
                          .submissions[0]?.answer ===
                        index + 1
                          ? "bg-blue-400"
                          : "bg-white border"
                      } font-medium rounded-md gap-3`}
                      onClick={() => {
                        submit({
                          variables: {
                            attempt_id: params.attempt_id,
                            question_id:
                              data.attempts_by_pk.test.questions[
                                currentQuestion
                              ].id,
                            answer: index + 1,
                          },
                        });
                      }}
                      disabled={submitting}
                    >
                      <div className="flex gap-3 items-center w-full">
                        <div
                          className={`w-6 h-6 rounded-full ${
                            data.attempts_by_pk.test.questions[currentQuestion]
                              .submissions[0]?.answer ===
                            index + 1
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                        />
                        <div className="w-full">
                          <div
                            className={`focus:outline-none p-2 rounded-md w-full ${
                              data.attempts_by_pk.test.questions[
                                currentQuestion
                              ].answer ===
                              index + 1
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            {option}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex py-2 justify-center border-t bg-gray-100 relative">
        <div
          className="absolute left-0 inset-y-0 flex items-center justify-center ml-5 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen((e) => !e);
          }}
        >
          {menuOpen ? (
            <AiOutlineMenuFold className="w-6 h-6" />
          ) : (
            <AiOutlineMenuUnfold className="w-6 h-6" />
          )}
        </div>
        <div className="flex gap-8 items-center">
          <div
            className={` rounded-md bg-gray-300 p-2 ${
              currentQuestion > 0
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (currentQuestion > 0) setCurrentQuestion((e) => e - 1);
            }}
          >
            <MdKeyboardArrowLeft className="w-6 h-6" />
          </div>
          <div className="text-lg font-medium">{`Question ${
            currentQuestion + 1
          }`}</div>
          <div
            className={` rounded-md bg-gray-300 p-2 ${
              currentQuestion < data.attempts_by_pk.test.questions.length - 1
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (
                currentQuestion <
                data.attempts_by_pk.test.questions.length - 1
              )
                setCurrentQuestion((e) => e + 1);
            }}
          >
            <MdKeyboardArrowRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestMain;
