import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { FileService } from './file.service';
import {
  DeleteFileInput,
  File,
  UploadFileInput,
  GetSingleFileInput,
} from './file.schema';

@Resolver()
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Query(() => [File])
  async getFiles() {
    return this.fileService.getFiles();
  }

  @Mutation(() => File)
  async uploadFile(@Args('input') fileObject: UploadFileInput) {
    fileObject.fileId = uuidv4();
    fileObject.revisionId = uuidv4();
    console.log('fileObject', fileObject);
    return this.fileService.uploadFile(fileObject);
  }

  @Mutation(() => File)
  async deleteFile(@Args('input') deleteFileInput: DeleteFileInput) {
    const { fileId } = deleteFileInput;
    const result = await this.fileService.deleteFile(fileId);
    return result;
  }

  @Query(() => File)
  async getOneFile(@Args('input') fileObj: GetSingleFileInput) {
    return await this.fileService.getFileByParams({ revisionId: fileObj.revisionId });
  }

  @Query(() => [File]) // New query resolver to get files by folderId
  async getFilesByFolderId(@Args('input') folderId: string) {
    return await this.fileService.getFileByFolderId(folderId);
  }

  @Query(() => File) // New query resolver to get files by folderId
  async generateApsUrnKey(@Args('input') fileId: string) {
    return await this.fileService.generateApsUrnKey(fileId);
  }
}
