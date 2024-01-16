import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($id: ID!, $projName: String!, $region: String!, $status: String!, $website: String ,$orgName: String!, $orgId: String!) {
    createProject(input: { _id: $id, projName: $projName, region: $region, status: $status, website: $website, orgName: $orgName, orgId: $orgId }) {
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