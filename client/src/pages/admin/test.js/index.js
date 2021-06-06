import React, { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { AiOutlineFileAdd } from "react-icons/ai";
import { BsInfo } from "react-icons/bs";
import TestDetails from "./TestDetails";
import ManageParticipants from "./ManageParticipants";
import Questions from "./Questions";
const Stepper = ({ step, setStep }) => {
  console.log("step", step);
  switch (step) {
    case 0:
      return <TestDetails step={step} setStep={setStep} />;
    case 1:
      return <Questions step={step} setStep={setStep} />;
    case 2:
      return <ManageParticipants step={step} setStep={setStep} />;
    default:
      return null;
  }
};
function Test() {
  const [step, setStep] = useState(0);
  return (
    <main>
      <section className="text-gray-600 body-font">
        <div className="container px-5 mt-12 mx-auto flex flex-wrap items-center">
          <div className="flex flex-wrap w-full">
            <div className="flex w-full justify-center">
              <div className="flex flex-col relative w-64">
                <div className="h-10 w-full absolute inset-0 flex items-center justify-center">
                  <div
                    className={`h-1 w-full ${
                      step > 0 ? "bg-green-600 bg-opacity-25" : "bg-gray-200"
                    } pointer-events-none`}
                  ></div>
                </div>
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${
                    step > 0
                      ? "bg-green-600"
                      : step === 0
                      ? "bg-indigo-700"
                      : "bg-indigo-400"
                  } inline-flex items-center justify-center text-white relative z-10 cursor-pointer`}
                  onClick={() => {
                    if (step > 0) setStep(0);
                  }}
                >
                  <BsInfo className="w-6 h-6" />
                </div>
                {/* <div className="">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    Test Info
                  </h2>
                </div> */}
              </div>
              <div className="flex flex-col relative w-60">
                <div className="h-10 w-full absolute inset-0 flex items-center justify-center">
                  <div
                    className={`h-1 w-full ${
                      step > 1 ? "bg-green-600 bg-opacity-25" : "bg-gray-200"
                    } pointer-events-none`}
                  ></div>
                </div>
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${
                    step > 1
                      ? "bg-green-600"
                      : step === 1
                      ? "bg-indigo-700"
                      : "bg-indigo-400"
                  } inline-flex items-center justify-center text-white relative z-10 cursor-pointer`}
                  onClick={() => {
                    if (step > 1) setStep(1);
                  }}
                >
                  <AiOutlineFileAdd className="w-6 h-6" />
                </div>
                {/* <div className="">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    Questions
                  </h2>
                </div> */}
              </div>
              <div className="flex flex-col relative">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${
                    step > 2
                      ? "bg-green-600"
                      : step === 2
                      ? "bg-indigo-700"
                      : "bg-indigo-400"
                  } inline-flex items-center justify-center text-white relative z-10 cursor-pointer`}
                  onClick={() => {
                    if (step > 2) setStep(2);
                  }}
                >
                  <FiUserPlus className="w-5 h-5" />
                </div>
                {/* <div className="">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    Participants
                  </h2>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-8">
        <Stepper step={step} setStep={setStep} />
      </section>
    </main>
  );
}

export default Test;
