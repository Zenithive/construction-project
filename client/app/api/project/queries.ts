import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query GetProjects($pageSize: Float!,$currentPage:Float!) {
    getProjects(input:{pageSize: $pageSize,currentPage:$currentPage}) {
      projects{
      projId
      projName
      region
      status
      website
      orgName
      orgId
    }
    totalProjects
    totalPages
    currentPage
  }
}
`;

export const GET_ALL_PROJECTS=gql`
  query GetAllProject{
    getAllProject{
      projId
      projName
      region
      status
      website
      orgName
      orgId
    }
  }
`;

