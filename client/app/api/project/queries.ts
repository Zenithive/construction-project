import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      _id
      projName
      region
      status
      website
      orgName
      orgId
    }
  }
`;
