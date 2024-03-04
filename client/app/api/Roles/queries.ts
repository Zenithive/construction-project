import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query GetRoles {
    getRoles {
      roleName
      roleId
      orginatorId
      users,
      orgId,
      projId
    }
  }
`;