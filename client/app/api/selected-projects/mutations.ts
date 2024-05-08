import { gql } from "@apollo/client";

export const ADD_SELECTED_PROJECTS = gql`
  mutation AddSelectedProject($input: AddSelectedProjectInput!) {
    addSelectedProject(input: $input) {
      projId
      projName
      userId
    }
  }
`;

export const REMOVE_SELECTED_PROJECTS = gql`
  mutation RemoveSelectedProject($input: RemoveSelectedProjectInput!) {
    removeSelectedProject(input: $input) {
      projId
      userId
    }
  }
`;
