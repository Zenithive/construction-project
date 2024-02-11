import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { FileService } from './file.service'
import { File, UploadFileInput } from './file.schema';


@Resolver()
export class FileResolver {
  constructor(
    private fileService: FileService,
  ) {}

  
  @Mutation(() => File)
  async uploadFile(@Args('input') fileObject: UploadFileInput) {
    return this.fileService.uploadFile(fileObject);
  }
}