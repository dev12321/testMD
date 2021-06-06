import gql from "graphql-tag";

export const FETCH_USER_DETAILS = gql`
  query MyQuery($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      fullName
      email
      type
      onboarded
    }
  }
`;
export const ONBOARD = gql`
  mutation MyMutation($id: uuid!, $fullName: String!) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { fullName: $fullName, onboarded: true }
    ) {
      id
      fullName
      email
      onboarded
    }
  }
`;
