import { gql } from "@apollo/client";

export const CREATE_NEW_ROLE = gql`
  mutation CreateNewRole($roleName: String!, $roleId: String!, $orginatorId: String!, $projId: String!,$orgId: String!, $users: [String!]!) {
    createNewRole(input: { roleName: $roleName, roleId: $roleId, orginatorId: $orginatorId, projId: $projId, orgId: $orgId, users: $users }) {
      roleName
      roleId
      orginatorId,
      projId,
      orgId,
      users
    }
  }
`;

export const EDITE_ROLES=gql`
mutation EditRole($roleName: String!, $roleId: String!, $orginatorId: String!, $projId: String!,$orgId: String!, $users: [String!]!) {
  editRole(input: { roleName: $roleName, roleId: $roleId, orginatorId: $orginatorId, projId: $projId, orgId: $orgId, users: $users }) {
    roleName
    roleId
    orginatorId,
    projId,
    orgId,
    users
  }
}
`

export const DELETE_Role = gql`
  mutation DeleteRole($roleId: String!) {
    deleterole(input:{roleId: $roleId}) {
      roleId
    }
  }
`;
export const UPDATE_ROLES_USERS = gql`
  mutation UpdateRole($allRolesData: UpdateRoleInputArray!) {
    updateRole(input: $allRolesData) {
      roleId
    }
  }
`;