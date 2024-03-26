import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query GetRoles($projId: String!) {
    getRoles(input: {projId: $projId}) {
      roleName
      roleId
      orginatorId
      users,
      orgId,
      projId
    }
  }
`;