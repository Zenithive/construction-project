import { gql } from "@apollo/client";

export const UPDATE_PERMISSIONS = gql`
  mutation updatePermissions($permission: String!, $permissionId: String!, $orginatorId: String!, $projId: String!) {
    createNewRole(input: { permission: $permission, permissionId: $roleId, orginatorId: $orginatorId, projId: $projId }) {
      projId
      permissionId
      permission,
      value,
      orginatorId
    }
  }
`;