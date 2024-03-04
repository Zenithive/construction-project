import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { v4 as uuidv4 } from 'uuid'; 
import { CreateFolderInput, Folder } from './folder.schema';
import { FolderService } from './folder.service';


@Resolver()
export class FolderResolver {
  constructor(
    private folderService: FolderService,
  ) {}

  @Query(() => [Folder])
  async getFolders() {
    return this.folderService.getFolders();
  }
  
  @Mutation(() => Folder)
  async createNewFolder(@Args('input') folderObject: CreateFolderInput) {
    folderObject.folderId = uuidv4();
    return this.folderService.createNewFolder(folderObject);
  }
}