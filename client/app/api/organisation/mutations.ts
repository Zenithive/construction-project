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
// for Editing Organisation
export const EDITE_ORGANISATION = gql`
  mutation EditOrg($contact: String!, $region: String!, $website: String ,$orgName: String!, $orgId: String!) {
    editOrg(input: { contact: $contact, region: $region, website: $website, orgName: $orgName, orgId: $orgId }) {
      region
      website
      orgName
      orgId
      contact
    }
  }
`;

// mutation for Delting org button
export const DELETE_ORGANISATION = gql`
mutation DeleteOrganisation($orgId: String!) {
  deleteOrganisation(input:{orgId:$orgId}){
    orgId
  }
}
`;