import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFolderInput, Folder, FolderDocument } from './folder.schema';



@Injectable()
export class FolderService {
    constructor(
        @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
    ) {

    }

    async getFolders(){
        return this.folderModel.find();
    }

    async createNewFolder(folderObject: CreateFolderInput){
            
        return await this.folderModel.create(folderObject);
    }

}