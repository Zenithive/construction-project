import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { v4 as uuidv4 } from 'uuid';
import { FileService } from './file.service'
import { DeleteFileInput, File, UploadFileInput, GetSingleFileInput, PaginationResultF, PaginationInputF } from './file.schema';

@Resolver()
export class FileResolver {
  constructor(
    private fileService: FileService,
  ) { }

  // ******** Query ******** //

  @Query(() => [File])
  async getFiles() {
    return this.fileService.getFiles();
  }

  @Query(() => File)
  async getOneFile(@Args('input') fileObj: GetSingleFileInput) {
    // Fetch file by apsUrnKey
    return await this.fileService.getFileByParams({revisionId: fileObj.revisionId});
  }

  @Query(() => PaginationResultF)
  async getFileByFolderId(
    @Args('input') paginationInputF: PaginationInputF,
  ) {
    // console.log("PaginationInputF", PaginationInputF)

    return this.fileService.getFileByFolderId(paginationInputF);
  }


  // ******** Mutation ******** //
  @Mutation(() => File)
  async uploadFile(@Args('input') fileObject: UploadFileInput) {
    fileObject.fileId = uuidv4();
    fileObject.revisionId = uuidv4();
    //fileObject.folderId = folderId;  
    console.log("fileObject", fileObject)
    return this.fileService.uploadFile(fileObject);
  }

  @Mutation(() => File)
  async deleteFile(@Args('input') deleteFileInput: DeleteFileInput) {

    const { fileId } = deleteFileInput;
    const result = await this.fileService.deleteFile(fileId);
    return result;

  }

  @Query(() => File)
  async generateApsUrnKey(@Args('input') fileId: string) {
    return await this.fileService.generateApsUrnKey(fileId);
  }

}








