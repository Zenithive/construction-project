import { gql } from "@apollo/client";

export const CREATE_ORGANISATION = gql`
  mutation CreateOrg($contact: String!, $region: String!, $website: String ,$orgName: String!, $orgId: String!) {
    createOrg(input: { contact: $contact, region: $region, website: $website, orgName: $orgName, orgId: $orgId }) {
      region
      website
      orgName
      orgId
      contact
    }
  }
`;