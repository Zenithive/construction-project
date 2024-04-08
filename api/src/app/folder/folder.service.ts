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

    async getFolderTreeIds(folderId: string){
        const folderIdsArray = [folderId];
        const folderData =  await this.folderModel.find({parentFolderId:folderId});
        for (let index = 0; index < folderData.length; index++) {
            const element = folderData[index];
            folderIdsArray.push(element.folderId);
            const childData= await this.getFolderTreeIds(element.folderId);
            folderIdsArray.push(...childData);
        }

        return folderIdsArray;
    }

}