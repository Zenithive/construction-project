import { gql } from "@apollo/client";

export const GET_PERMISSIONS = gql`
  query GetPermissions($projId: String!) {
    getPermissions(input: {projId: $projId}) {
      projId
      permissionId
      permissionLabel,
      permissionKey,
      roleId,
      value,
      orginatorId,
      createdBy,
      updatedBy
    }
  }
`;