import { gql } from "@apollo/client";

export const CREATE_NEW_STATUS = gql`
  mutation CreateNewStatus($statusId: String!, $statusName: String!, $projId: String!,$orgId: String!,$userId:String!) {
    createNewStatus(input: { statusId: $statusId, statusName: $statusName, projId: $projId, orgId: $orgId, userId: $userId }) {
      statusId,
      statusName,
      projId,
      orgId,
      userId
    }
  }
`;


export const DELETE_Status = gql`
  mutation DeleteStatus($statusId: String!) {
    deletestatus(input:{statusId: $statusId}) {
        statusId
    }
  }
`;