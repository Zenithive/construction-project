import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($projId: String!, $projName: String!, $region: String!, $status: String!, $website: String ,$orgName: String!, $orgId: String!, $orginatorId: String!) {
    createProject(input: { projId: $projId, projName: $projName, region: $region, status: $status, website: $website, orgName: $orgName, orgId: $orgId, orginatorId: $orginatorId }) {
      projId
      orginatorId
      projName
      region
      status
      website
      orgName
      orgId
    }
  }
`;