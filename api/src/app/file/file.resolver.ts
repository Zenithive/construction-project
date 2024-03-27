import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { v4 as uuidv4 } from 'uuid'; 
import { FileService } from './file.service'
import { DeleteFileInput, File, UploadFileInput, GetSingleFileInput } from './file.schema';

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



  @Mutation(() => File)
  async deleteFile(@Args('input') deleteFileInput: DeleteFileInput) {
    
      const { fileId } = deleteFileInput;
      const result = await this.fileService.deleteFile(fileId);
      return result;
    
  }

////////////// SACHIN CODE FOR GET ONE FILE //////////////////




  @Query(() => File)  
  async getOneFile(@Args('input') fileObj: GetSingleFileInput) {
    // Fetch file by apsUrnKey
    return await this.fileService.getFileByApsUrn(fileObj.urn);
  }

  
}

////////////// SACHIN CODE FOR DOWNLOAD ONE FILE //////////////////




