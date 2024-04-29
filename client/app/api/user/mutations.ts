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
export const EDITE_USER = gql`
  mutation EditUser( $email: String!, $lastName: String!, $firstName: String, $userId: String!,$phoneNo: String!, $subscriptionId: Float!,$orgId: String!) {
    editUser(input: { email: $email, lastName: $lastName, firstName: $firstName, userId: $userId ,phoneNo: $phoneNo, subscriptionId: $subscriptionId,orgId: $orgId}) {
      email
      lastName
      firstName
      userId
      phoneNo
      orgId
      subscriptionId
    }
  }
`;

export const CREATE_USER_BY_ADMIN = gql`
  mutation CreateUserByAdmin( $email: String!, $lastName: String!, $firstName: String, $userId: String!, $phoneNo: String!, $subscriptionId: Float!,$orgId: String!) {
    createUserByAdmin(input: { email: $email, lastName: $lastName, firstName: $firstName, userId: $userId, phoneNo: $phoneNo, subscriptionId: $subscriptionId,orgId: $orgId }) {
      email
      lastName
      firstName
      userId
      orgId
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      token
      userObj{
        userId
        firstName
        lastName
        email
      }

    }
  }
`;


// sachin code
export const DELETE_USER = gql`
  mutation DeleteUser($userId: String!) {
    deleteUser(input:{userId: $userId}) {
      userId
    }
  }
`;