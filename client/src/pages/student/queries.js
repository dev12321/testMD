import gql from "graphql-tag";
export const GET_TESTS = gql`
  query MyQuery {
    attempts(order_by: { created_at: desc }) {
      id
      marked_malpractice
      expiry_date
      appeal {
        id
        message
        resoponse
        attempt_id
        status
      }
      test {
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
  }
`;

export const APPEAL = gql`
  mutation MyMutation($attempt_id: uuid!, $message: String!) {
    insert_appeal_one(object: { attempt_id: $attempt_id, message: $message }) {
      id
      message
      resoponse
      attempt_id
      status
    }
  }
`;
