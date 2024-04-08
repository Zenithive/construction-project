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

export const DELETE_Role = gql`
  mutation DeleteRole($roleId: String!) {
    deleterole(input:{roleId: $roleId}) {
      roleId
    }
  }
`;
export const UPDATE_Role = gql`
  mutation UpdateRole($roleId: String!,$users: [String!]!) {
    updateRole(input:[{roleId: $roleId,users: $users}]) {
      roleId
      users
    }
  }
`;