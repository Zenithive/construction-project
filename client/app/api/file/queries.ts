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




export const GET_FILES_BY_FOLDER_ID = gql`
  query GetFilesByFolderId($folderId: String!,$pageSize: Float!,$currentPage:Float!) {
    getFileByFolderId(input: { folderId: $folderId, pageSize: $pageSize, currentPage: $currentPage }) {
      files{
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
    totalFiles   ###
    totalPages
    currentPage
    }
  }
`;


