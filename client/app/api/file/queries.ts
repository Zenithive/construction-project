import { gql } from '@apollo/client';

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
  query GetOneFile($revisionId: String!) {
    getOneFile(input: { revisionId: $revisionId }) {
      apsUrnKey
      originalname
      revisionId
    }
  }
`;

export const GET_FILES_BY_FOLDER_ID = gql`
  query GetFilesByFolderId(
    $folderId: String!
    $pageSize: Float!
    $currentPage: Float!
  ) {
    getFileByFolderId(
      input: {
        folderId: $folderId
        pageSize: $pageSize
        currentPage: $currentPage
      }
    ) {
      files {
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
        revisionId
      }
      totalFiles ###
      totalPages
      currentPage
    }
  }
`;

export const GENERATE_APS_URN_KEY = gql`
  query GenerateApsUrnKey($fileId: String!) {
    generateApsUrnKey(input:$fileId) {
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