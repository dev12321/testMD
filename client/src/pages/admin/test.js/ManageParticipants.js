import React, { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "react-apollo";
import { GET_ADDED_ATTEMPTS, ADD_ATTEMPT } from "./queries";
import { useTable, useGroupBy, useExpanded } from "react-table";
import { toast } from "react-toastify";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { useRouteMatch } from "react-router";

const Schema = Yup.object().shape({
  email: Yup.string().nullable().required("Required").email("Invalid email"),
  fullName: Yup.string().nullable(),
  expiry_date: Yup.date().nullable(),
});
function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { groupBy, expanded },
  } = useTable(
    {
      columns,
      data,
    },
    useGroupBy,
    useExpanded // useGroupBy would be pretty useless without useExpanded ;)
  );

  return (
    <>
      <table {...getTableProps()} className="w-full my-8">
        <thead className="bg-black text-white rounded-t-md text-left">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="px-5 py-3">
                  {column.canGroupBy ? (
                    // If the column can be grouped, let's add a toggle
                    <span {...column.getGroupByToggleProps()}>
                      {column.isGrouped ? "🛑 " : "👊 "}
                    </span>
                  ) : null}
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`${i % 2 === 0 ? "bg-gray-200" : ""}`}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={`px-5 py-3`}
                      {...cell.getCellProps()}
                      style={{
                        background: cell.isGrouped
                          ? "#0aff0082"
                          : cell.isAggregated
                          ? "#ffa50078"
                          : cell.isPlaceholder
                          ? "#ff000042"
                          : "",
                      }}
                    >
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "👇" : "👉"}
                          </span>{" "}
                          {cell.render("Cell")} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function ManageParticipants({ step, setStep }) {
  const { params } = useRouteMatch();
  const { data, loading, error } = useQuery(GET_ADDED_ATTEMPTS, {
    variables: {
      test_id: params.test_id,
    },
  });
  const [giveAttemptToTest, { loading: updating }] = useMutation(ADD_ATTEMPT, {
    onCompleted: () => {
      toast.success("Operation sucessfull");
    },
    update: (cache, { data: { insert_users_one } }) => {
      if (insert_users_one) {
        try {
          const query = GET_ADDED_ATTEMPTS;
          const data = cache.readQuery({
            query,
            variables: {
              test_id: params.test_id,
            },
          });
          const { attempts, ...user } = insert_users_one;
          data.attempts = [
            {
              ...attempts[0],
              user,
            },
            ...data.attempts,
          ];
          cache.writeQuery({
            query,
            variables: {
              test_id: params.test_id,
            },
            data: { ...data },
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    },
  });

  const rows = useMemo(() => {
    if (data?.attempts) {
      return data.attempts.map((attempt) => {
        return {
          id: attempt.id,
          status: attempt.status,
          marked_malpractice: attempt.marked_malpractice ? "Yes" : "No",
          expiry_date: attempt.expiry_date,
          email: attempt.user.email,
          fullName: attempt.user.fullName,
        };
      });
    }
    return [];
  }, [data?.attempts]);
  console.log("data", data);
  console.log("rows", rows);
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "fullName",
        canGroupBy: false,
      },
      {
        Header: "Email",
        accessor: "email",
        aggregate: "uniqueCount",
        Aggregated: ({ value }) => `${value} Unique Accounts`,
        canGroupBy: true,
      },

      {
        Header: "Status",
        accessor: "status",
        canGroupBy: true,
      },

      {
        Header: "Did malpractice?",
        accessor: "marked_malpractice",
        canGroupBy: true,
      },
      {
        Header: "Expiry Date",
        accessor: "expiry_date",
        canGroupBy: false,
      },
    ],
    []
  );

  return (
    <div class="container px-5 mt-12 mx-auto flex flex-col items-center">
      <Formik
        validationSchema={Schema}
        initialValues={{
          email: "",
          expiry_date: null,
        }}
        onSubmit={({ email, expiry_date }, actions) => {
          giveAttemptToTest({
            variables: {
              test_id: params.test_id,
              email,
              expiry_date,
            },
          }).then(() => {
            actions.resetForm();
          });
        }}
      >
        {({ handleSubmit, values, errors, handleChange, setFieldValue }) => (
          <Form
            onSubmit={handleSubmit}
            className="mx-auto w-full lg:w-2/3 xl:w-1/2"
          >
            <div className="mt-5">
              <label className="mui-textfield-outlined w-full">
                <input
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  placeholder=" "
                  className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-r1"
                />
                <span>Email</span>
              </label>
              <ErrorMessage
                component="div"
                className="text-red-600"
                name="email"
              />
            </div>
            <div className="mt-5">
              <label className="mui-textfield-outlined w-full">
                <input
                  type="datetime-local"
                  name="expiry_date"
                  onChange={handleChange}
                  value={values.expiry_date}
                  placeholder=" "
                  className="form-input p-3 w-full bg-white focus:shadow-none text-sm border-gray-400 focus:border-blue-r1"
                />
                <span>Expiry Date</span>
              </label>
              <ErrorMessage
                component="div"
                className="text-red-600"
                name="expiry_date"
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
            </div>
          </Form>
        )}
      </Formik>
      {rows?.length > 0 ? <Table columns={columns} data={rows} /> : null}
    </div>
  );
}

export default ManageParticipants;
