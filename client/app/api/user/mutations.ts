import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser( $email: String!, $password: String!, $lastName: String!, $firstName: String, $userId: String!) {
    createUser(input: { email: $email, password: $password, lastName: $lastName, firstName: $firstName, userId: $userId }) {
      email
      lastName
      firstName
      userId
    }
  }
`;

export const CREATE_USER_BY_ADMIN = gql`
  mutation CreateUserByAdmin( $email: String!, $lastName: String!, $firstName: String, $userId: String!, $phoneNo: String!, $subscriptionId: Float!) {
    createUserByAdmin(input: { email: $email, lastName: $lastName, firstName: $firstName, userId: $userId, phoneNo: $phoneNo, subscriptionId: $subscriptionId }) {
      email
      lastName
      firstName
      userId
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      token
      userObj{
        id
        firstName
        lastName
        email
      }

    }
  }
`;
