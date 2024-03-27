import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      email
      lastName
      firstName
      status
      userId
    }
  }
`;


export const LOGOUT = gql`
  query Logout {
    logout {
      message
    }
  }
`;
