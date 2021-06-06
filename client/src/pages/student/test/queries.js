import gql from "graphql-tag";

export const GET_TEST_INFO = gql`
  query MyQuery($id: uuid!) {
    attempts_by_pk(id: $id) {
      id
      status
      start_at
      test {
        id
        instructions
        duration
        title
        questions_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

export const START = gql`
  mutation MyMutation($id: uuid!, $start_at: timestamptz) {
    update_attempts_by_pk(
      pk_columns: { id: $id }
      _set: { status: "inprogress", start_at: $start_at }
    ) {
      id
      status
      start_at
    }
  }
`;
export const SUBMIT = gql`
  mutation MyMutation($id: uuid!) {
    update_attempts_by_pk(
      pk_columns: { id: $id }
      _set: { status: "complete" }
    ) {
      id
      status
    }
  }
`;

export const GET_FULL_TEST_AND_ATTEMPT_DATA = gql`
  query MyQuery($id: uuid!) {
    attempts_by_pk(id: $id) {
      id
      marked_malpractice
      status
      start_at
      test {
        id
        duration
        title
        questions(order_by: { order: asc }) {
          id
          options
          title
          submissions(where: { attempt_id: { _eq: $id } }) {
            id
            answer
            question_id
          }
        }
      }
    }
  }
`;
export const SUBMIT_ANSWER = gql`
  mutation MyMutation($answer: Int!, $question_id: uuid!, $attempt_id: uuid!) {
    insert_submissions_one(
      object: {
        answer: $answer
        question_id: $question_id
        attempt_id: $attempt_id
      }
      on_conflict: {
        constraint: submissions_question_id_attempt_id_key
        update_columns: answer
      }
    ) {
      id
      answer
      question_id
    }
  }
`;

export const ADD_LOG = gql`
  mutation MyMutation($object: malpractice_logs_insert_input!, $id: uuid!) {
    insert_malpractice_logs_one(object: $object) {
      id
    }
    update_attempts_by_pk(
      pk_columns: { id: $id }
      _set: { marked_malpractice: true }
    ) {
      id
    }
  }
`;
