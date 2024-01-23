import { gql } from "@apollo/client";

export const GET_ORGANISATIONS = gql`
  query GetAllOrg {
    getAllOrg {
      region
      status
      website
      orgName
      orgId
    }
  }
`;
