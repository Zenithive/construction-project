import { gql } from "@apollo/client";

export const GET_STATUS = gql`
  query GetStatus($projId: String!) {
    getStatus(input: {projId: $projId}) {
        statusId,
        statusName,
        projId,
        orgId,
        userId
    }
  }
`;