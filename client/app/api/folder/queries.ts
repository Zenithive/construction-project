import { gql } from "@apollo/client";

export const GET_FOLDERS= gql`
  query GetFolders {
    getFolders {
      folderName
      folderId
      status
      orginatorId
      projectId
      orgId
      parentFolderId
    }
  }
`;
