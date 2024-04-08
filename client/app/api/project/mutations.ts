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


// sachin code
export const DELETE_PROJECT = gql`
  mutation DeleteProject($projId: String!) {
    deleteProject(input:{projId: $projId}) {
      projId
    }
  }
`;

// export const FILTER_PROJECTS = gql`
//   query FilterProjects($offset: Int, $limit: Int, $filters: ProjectFilterInput) {
//     filterProjects(offset: $offset, limit: $limit, filters: $filters) {
//       projId
//       projName
//       region
//       status
//       website
//       orgName
//       orgId
//     }
//   }
// `;