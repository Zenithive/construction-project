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


//////////// Sachin code for get file for one   particular document ////////////////////

export const GET_ONE_FILE = gql`
query GetOneFile($urn: String!){
    getOneFile(input:{urn:$urn}) {
      apsUrnKey
      originalname
      }  
  }
 `; 



