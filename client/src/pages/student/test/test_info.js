import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { useRouteMatch } from "react-router";
import { toast } from "react-toastify";
import { exams } from "../../../assets/illustrations";
import { GET_TEST_INFO, START } from "./queries";
import WebCamStreaming from "./WebcamStreamHandler";
import axios from "axios";
function TestInfo({ loading, data }) {
  const { params } = useRouteMatch();
  const [step, setStep] = useState(0);
  const [snap, setSnap] = useState(null);
  const [registering, setRegistering] = useState(false);
  // const register_face =
  const [start] = useMutation(START);
  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="w-full bg-gray-800 lg:flex items-center justify-center hidden col-span-4 xl:col-span-6">
        <img alt="illustration" src={exams} />
      </div>
      <div className="w-full col-span-8 xl:col-span-6 p-5 flex flex-col justify-center">
        {loading ? (
          <div className="flex min-h-screen w-full justify-center items-center self-center">
            <div className="spinner-grow w-6 h-6 mr-3"></div>
            <p>Please Wait</p>
          </div>
        ) : step === 0 ? (
          <div className="flex flex-col">
            <div className="whitespace-pre">
              {data?.attempts_by_pk?.test.instructions}
            </div>
            <div className="flex justify-end">
              <div
                className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mt-12 px-5"
                onClick={() => {
                  setStep(1);
                  // start({
                  //   variables: {
                  //     id: params.attempt_id,
                  //   },
                  // });
                }}
              >
                Next
              </div>
            </div>
          </div>
        ) : snap === null || step === 1 ? (
          <WebCamStreaming>
            {({
              cameraStream,
              captureSnapshot,
              sleep,
              recordAudio,
              videoRef,
            }) => {
              console.log("cameraStream", cameraStream);
              return (
                <div className="flex justify-center items-center flex-col">
                  <video
                    ref={videoRef}
                    autoPlay={true}
                    muted={true}
                    className={`w-96 mx-5 object-cover`}
                  ></video>
                  <div className="flex justify-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mt-12 px-5"
                      onClick={() => {
                        setStep(0);
                        // start({
                        //   variables: {
                        //     id: params.attempt_id,
                        //   },
                        // });
                      }}
                    >
                      Previous
                    </div>
                    <div
                      className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mt-12 px-5"
                      onClick={() => {
                        captureSnapshot().then((e) => {
                          setSnap(e);
                          setStep(2);
                          console.log(e);
                        });
                        // start({
                        //   variables: {
                        //     id: params.attempt_id,
                        //   },
                        // });
                      }}
                    >
                      Next
                    </div>
                  </div>
                </div>
              );
            }}
          </WebCamStreaming>
        ) : snap && step === 2 ? (
          <div className="flex justify-center items-center flex-col">
            <img
              alt="snap"
              src={snap.url}
              className={`w-110 h-96 mx-5 object-cover`}
            />
            <div className="flex gap-5">
              <div
                className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mt-12 px-5"
                onClick={() => {
                  setStep(1);
                  setSnap(null);
                }}
              >
                Previous
              </div>
              <div
                className="flex items-center justify-center rounded-md bg-blue-600 text-white py-2 mt-12 px-5"
                onClick={() => {
                  setRegistering(true);
                  let uploadImageForm = new FormData();
                  // uploadImageForm.append("file", {
                  //   type: "image/jpg",
                  //   uri: snap.url,
                  //   name: `${params.attempt_id}.jpeg`,
                  // });
                  uploadImageForm.append(
                    "file",
                    snap.blob,
                    `${params.attempt_id}.jpg`
                  );
                  uploadImageForm.append("id", params.attempt_id);
                  // fetch("http://localhost:5002/register", {
                  //   method: "POST",
                  //   headers: { "Content-Type": "multipart/form-data" },
                  //   body: uploadImageForm,
                  // })
                  //   .then((response) => response.json())
                  axios({
                    method: "post",
                    url: "http://localhost:5002/register",
                    data: uploadImageForm,
                    headers: { "Content-Type": "multipart/form-data" },
                  })
                    .then((response) => {
                      console.log(response);

                      if (response.data.state === "complete") {
                        toast.success("Face Registered");
                        start({
                          variables: {
                            id: params.attempt_id,
                            start_at: new Date(),
                          },
                        }).then(() => {
                          setRegistering(false);
                        });
                      } else {
                        setRegistering(false);
                        setStep(1);
                        toast.error(response.data.error);
                      }
                    })
                    .catch(() => {
                      setRegistering(false);
                      toast.error("Error on Network");
                      setStep(1);
                    });
                }}
              >
                {registering ? (
                  <>
                    <div className="spinner-grow w-6 h-6"></div>
                    <div>Updating</div>
                  </>
                ) : (
                  "Submit"
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TestInfo;
