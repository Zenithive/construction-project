import { gql } from "@apollo/client";

export const GET_ORGANISATIONS = gql`
  query GetAllOrg($pageSize: Float!,$currentPage:Float!) {
    getAllOrg(input:{pageSize: $pageSize,currentPage:$currentPage}){
      orgs{
      region
      status
      website
      orgName
      contact
      orgId
    }
    totalOrgs
    totalPages
    currentPage
  }
  }
`;
