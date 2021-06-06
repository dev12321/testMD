import React, { useContext, useState } from "react";
import { AuthContext } from "../../firebase";
import { MdAdd, MdClose } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "react-apollo";
import { APPEAL, CREATE_TEST, GET_TESTS } from "./queries";
import { nodata } from "../../assets/illustrations";
import { Frame } from "framer-motion";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import { formatDistanceToNowStrict } from "date-fns";
import { Header } from "../../components";
const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function Dashboard() {
  const history = useHistory();
  const { data, loading, error } = useQuery(GET_TESTS);
  const [attempt, setAttempt] = useState(null);
  const [message, setMessage] = useState("");
  const [makeAppeal, { loading: creating }] = useMutation(APPEAL, {
    update: (cache, { data: { insert_appeal_one } }) => {
      if (insert_appeal_one) {
        try {
          const cdata = cache.readQuery({
            query: GET_TESTS,
          });
          cdata.attempts = cdata.attempts.map((attempt) => {
            if (attempt.id === insert_appeal_one.attempt_id) {
              return {
                ...attempt,
                appeal: insert_appeal_one,
              };
            } else {
              return attempt;
            }
          });
          console.log("cdata", cdata);
          cache.writeQuery({
            query: GET_TESTS,
            data: { ...cdata },
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    },
  });
  return (
    <>
      <Header />
      <main className="flex flex-col flex-grow">
        <div className="h-64 bg-gray-800 py-3 flex flex-col justify-center">
          <div className="text-white container mx-auto px-5 text-3xl">
            Hello there,
          </div>
          <div className="text-white container mx-auto px-5 text-lg leading-none mt-3">
            Welcome to TestMD, Below you can see the tests you've been given
            access to. <br />
            Just click on any one of them to attempt the test.
          </div>
        </div>
        <div className="flex flex-col flex-grow bg-gray-100 overflow-y-auto h-64">
          {loading ? (
            <div></div>
          ) : data?.attempts?.length > 0 ? (
            <motion.ul
              className="container mx-auto grid md:grid-cols-2 p-5 gap-5"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {data.attempts.map(
                (
                  {
                    id,
                    marked_malpractice,
                    appeal,
                    test: { id: test_id, title, created_at },
                  },
                  index
                ) => (
                  <motion.li
                    key={index}
                    variants={item}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-md border p-5 flex gap-3 cursor-pointer"
                    onClick={() => {
                      history.push(`/student/test/${id}`);
                    }}
                  >
                    <div>
                      <CgNotes className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex flex-grow">
                        <div title={title}>{title}</div>
                      </div>
                      {marked_malpractice ? (
                        <div className="flex justify-end">
                          <button
                            className="py-2 px-3 bg-blue-600 rounded-md text-white font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (!appeal) setAttempt(data.attempts[index]);
                              else {
                                toast.error(
                                  "You have already submitted an appeal"
                                );
                              }
                            }}
                          >
                            Appeal
                          </button>
                        </div>
                      ) : null}
                      <div className="text-xs text-right w-full">
                        {formatDistanceToNowStrict(new Date(created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </motion.li>
                )
              )}
            </motion.ul>
          ) : (
            <div className="flex flex-col flex-grow p-5 items-center justify-center">
              <img alt="no data" src={nodata} className="h-40 w-40" />
              <div>No tests found</div>
            </div>
          )}
        </div>
      </main>
      {attempt && !attempt.appeal ? (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setAttempt(null);
            setMessage("");
          }}
        >
          <motion.div
            className="flex flex-col bg-white rounded-md w-96 relative"
            initial="hidden"
            animate="visible"
            variants={container}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="py-4 px-8 bg-black rounded-t-md text-lg text-white flex justify-between gap-3">
              <div>Create Test</div>
              <button
                className=""
                onClick={(e) => {
                  e.preventDefault();
                  setAttempt(null);
                  setMessage("");
                }}
              >
                <MdClose />
              </button>
            </div>
            <div className="p-5 w-full">
              <div className="w-full">
                <label className="mui-textfield-outlined w-full">
                  <textarea
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    value={message}
                    placeholder=" "
                    className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-r1"
                  />
                  <span>Message</span>
                </label>
              </div>
              <div className="flex justify-center mt-5">
                <button
                  className="bg-blue-600 text-white rounded-md px-5 py-2 flex justify-center items-center gap-3"
                  onClick={() => {
                    makeAppeal({
                      variables: {
                        attempt_id: attempt.id,
                        message,
                      },
                    });
                  }}
                >
                  {creating ? (
                    <>
                      <div className="spinner-grow w-6 h-6"></div>
                      <div>Creating</div>
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </>
  );
}

export default Dashboard;
