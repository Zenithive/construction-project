import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers($pageSize: Float!,$currentPage:Float!) {
    getUsers(input:{pageSize: $pageSize,currentPage:$currentPage}) {
      users{
      email
      lastName
      firstName
      status
      userId
      phoneNo
      subscriptionId
    }
    totalUsers
    totalPages
    currentPage
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
