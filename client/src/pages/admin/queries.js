import gql from "graphql-tag";

export const GET_TESTS = gql`
  query MyQuery {
    tests(order_by: { created_at: desc }) {
      id
      title
      created_at
      duration
      questions_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
export const CREATE_TEST = gql`
  mutation MyMutation($title: String!) {
    insert_tests_one(object: { title: $title }) {
      id
      title
      created_at
      duration
      questions_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
