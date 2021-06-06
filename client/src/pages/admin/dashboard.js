import React, { useContext, useState } from "react";
import { AuthContext } from "../../firebase";
import { MdAdd, MdClose } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "react-apollo";
import { CREATE_TEST, GET_TESTS } from "./queries";
import { nodata } from "./../../assets/illustrations";
import { Frame } from "framer-motion";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import { formatDistanceToNowStrict } from "date-fns";
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
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const { data, loading, error } = useQuery(GET_TESTS);
  const [createTest, { loading: creating }] = useMutation(CREATE_TEST, {
    onCompleted: ({ insert_tests_one }) => {
      toast.success("Test created successfully.");
      setOpen(false);
      history.push(`/admin/test/${insert_tests_one.id}`);
    },
    update: (cache, { data: { insert_tests_one } }) => {
      if (insert_tests_one) {
        const query = GET_TESTS;
        try {
          const data = cache.readQuery({
            query: query,
          });
          data.tests = [insert_tests_one, ...data.tests];
          cache.writeQuery({
            query: query,
            data,
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
  });
  const createTestHandler = () => {
    if (!title) {
      toast.error("Title can't be empty");
    } else {
      createTest({
        variables: {
          title,
        },
      });
    }
  };
  return (
    <main className="flex flex-col flex-grow">
      <div className="h-64 bg-gray-800 py-3 flex flex-col justify-center">
        <div className="text-white container mx-auto px-5 text-3xl">
          Hello there,
        </div>
        <div className="text-white container mx-auto px-5 text-lg leading-none mt-3">
          Welcome to TestMD, Below you can see the tests you've created. <br />
          If you haven't done it already just click on Create Test button to get
          started.
        </div>
      </div>
      <div className="flex flex-col flex-grow bg-gray-100 overflow-y-auto h-64">
        {loading ? (
          <div></div>
        ) : data?.tests?.length > 0 ? (
          <motion.ul
            className="container mx-auto grid md:grid-cols-2 p-5 gap-5"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {data.tests.map(({ id, title, created_at }, index) => (
              <motion.li
                key={index}
                variants={item}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-md border p-5 flex gap-3 cursor-pointer"
                onClick={() => {
                  history.push(`/admin/test/${id}`);
                }}
              >
                <div>
                  <CgNotes className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-grow">
                    <div title={title}>{title}</div>
                  </div>
                  <div className="text-xs text-right w-full">
                    {formatDistanceToNowStrict(new Date(created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="flex flex-col flex-grow p-5 items-center justify-center">
            <img alt="no data" src={nodata} className="h-40 w-40" />
            <div>No tests found</div>
          </div>
        )}
      </div>
      <motion.button
        className="fixed mb-12 mr-12 bg-blue-600 w-16 h-16 rounded-full bottom-0 right-0 flex justify-center items-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        <MdAdd className="text-white w-8 h-8" />
      </motion.button>
      {open ? (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
            setTitle("");
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
                  setOpen(false);
                  setTitle("");
                }}
              >
                <MdClose />
              </button>
            </div>
            <div className="p-5 w-full">
              <div className="w-full">
                <label className="mui-textfield-outlined w-full">
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    placeholder=" "
                    className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-r1"
                  />
                  <span>Title</span>
                </label>
              </div>
              <div className="flex justify-center mt-5">
                <button
                  className="bg-blue-600 text-white rounded-md px-5 py-2 flex justify-center items-center gap-3"
                  onClick={createTestHandler}
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
    </main>
  );
}

export default Dashboard;
