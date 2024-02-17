import { gql } from "@apollo/client";

export const SAVE_FILE_DATA = gql`
  mutation UploadFile($fileName: String!, $originalname: String!, $path: String!, $status: String!, $orginatorId: String! ,$extension: String!, $size: Float!, $docRef: String!, $revision: String!, $projectId: String!, $userId: String!) {
    uploadFile(input: { fileName: $fileName, originalname: $originalname, path: $path, status: $status, orginatorId: $orginatorId, extension: $extension, size: $size, docRef: $docRef, revision: $revision, projectId: $projectId, userId: $userId }) {
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
    }
  }
`;