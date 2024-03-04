import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { v4 as uuidv4 } from 'uuid'; 
import { FileService } from './file.service'
import { File, UploadFileInput } from './file.schema';

@Resolver()
export class FileResolver {
  constructor(
    private fileService: FileService,
  ) {}

  @Query(() => [File])
  async getFiles() {
    return this.fileService.getFiles();
  }
  
  @Mutation(() => File)
  async uploadFile(@Args('input') fileObject: UploadFileInput) {
    fileObject.fileId = uuidv4();
    fileObject.revisionId = uuidv4();
    console.log("fileObject", fileObject)
    return this.fileService.uploadFile(fileObject);
  }
}