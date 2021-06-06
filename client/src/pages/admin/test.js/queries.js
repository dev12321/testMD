import gql from "graphql-tag";
export const UPDATE_TEST = gql`
  mutation MyMutation($data: tests_set_input!, $id: uuid!) {
    update_tests_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
      title
      duration
      instructions
    }
  }
`;
export const GET_TEST = gql`
  query MyQuery($id: uuid!) {
    tests_by_pk(id: $id) {
      id
      instructions
      duration
      title
    }
  }
`;
export const GET_QUESTIONS = gql`
  query MyQuery($test_id: uuid!) {
    questions(where: { test_id: { _eq: $test_id } }) {
      id
      options
      answer
      title
    }
  }
`;
export const INSERT_QUESTION = gql`
  mutation MyMutation($object: questions_insert_input!) {
    insert_questions_one(
      object: $object
      on_conflict: {
        constraint: questions_pkey
        update_columns: [answer, options, title]
      }
    ) {
      id
      options
      answer
      title
    }
  }
`;
export const DELETE_QUESTION = gql`
  mutation MyMutation($id: uuid!) {
    delete_questions_by_pk(id: $id) {
      id
    }
  }
`;
export const ADD_ATTEMPT = gql`
  mutation MyMutation(
    $expiry_date: timestamptz
    $email: String!
    $test_id: uuid!
  ) {
    insert_users_one(
      object: { email: $email }
      on_conflict: { constraint: users_email_key, update_columns: [] }
    ) {
      id
    }
    insert_attempts_one(
      object: {
        test_id: $test_id
        expiry_date: $expiry_date
        user_email: $email
      }
    ) {
      id
      expiry_date
      status
      marked_malpractice
      user {
        id
        fullName
        email
      }
    }
  }
`;
export const GET_ADDED_ATTEMPTS = gql`
  query MyQuery($test_id: uuid!) {
    attempts(
      order_by: { updated_at: desc }
      where: { test_id: { _eq: $test_id } }
    ) {
      id
      expiry_date
      status
      marked_malpractice
      user {
        id
        fullName
        email
      }
    }
  }
`;
