import { gql } from "@apollo/client";

export const GET_FILES = gql`
  query GetFiles {
    getFiles {
      fileName
      originalname
      path
      status
      orginatorId
      extension
      size
      docRef
      revision
      projectId
      userId
      fileId
      apsUrnKey
    }
  }
`;