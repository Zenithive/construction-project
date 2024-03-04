import { gql } from "@apollo/client";

export const CREATE_NEW_ROLE = gql`
  mutation CreateNewRole($roleName: String!, $roleId: String!, $orginatorId: String!, $projId: String!,$orgId: String!) {
    createNewRole(input: { roleName: $roleName, roleId: $roleId, orginatorId: $orginatorId, projId: $projId, orgId: $orgId }) {
      roleName
      roleId
      orginatorId,
      projId,
      orgId
    }
  }
`;