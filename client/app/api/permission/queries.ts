import { gql } from "@apollo/client";

export const GET_PERMISSIONS = gql`
  query GetPermissions {
    getPermissions {
      projId
      permissionId
      permission,
      value,
      orginatorId,
      createdBy,
      updatedBy
    }
  }
`;