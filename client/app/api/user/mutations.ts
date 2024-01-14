import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($id: ID!, $email: String!, $password: String!, $lastName: String!, $firstName: String) {
    createUser(input: { _id: $id, email: $email, password: $password, lastName: $lastName, firstName: $firstName }) {
      _id
      email
      lastName
      firstName
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      token
    }
  }
`;
