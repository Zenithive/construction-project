import { gql } from "@apollo/client";

export const CREATE_NEW_FOLDER = gql`
  mutation CreateNewFolder($folderName: String!, $orgId: String!, $parentFolderId: String!, $orginatorId: String!, $folderId: String!, $projectId: String!) {
    createNewFolder(input: { folderName: $folderName, orgId: $orgId, parentFolderId: $parentFolderId, orginatorId: $orginatorId, folderId: $folderId, projectId: $projectId}) {
      folderName
      orginatorId
      projectId
      orgId
      folderId
      parentFolderId
    }
  }
`;