import { gql } from "@apollo/client";

export const UPDATE_PERMISSIONS = gql`
  mutation UpdatePermission($permissionId: String!, $roleId: String!, $value: Boolean!, $orginatorId: String!) {
    updatePermission(input: { permissionId: $permissionId, roleId: $roleId, value: $value, orginatorId: $orginatorId }) {
      projId
      roleId
      permissionId
      value,
      orginatorId
    }
  }
`;