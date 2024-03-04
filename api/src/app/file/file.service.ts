import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument, UploadFileInput } from './file.schema';
//import { FileStorageUtil } from '../util/file-storage.util';
import { ApsForgeService } from '../aps-forge/aps.forge.service';



@Injectable()
export class FileService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        private apsForgeService: ApsForgeService,
    ) {

    }

    async getFiles(){
        return this.fileModel.find();
    }


    async uploadFile(fileObject: UploadFileInput){
        const apsFilesObject  = await this.apsForgeService.uploadObject(fileObject.originalname, fileObject.path);
        console.log("apsFilesObject 1", apsFilesObject)
        const apsUrnObj = await this.apsForgeService.translateObject(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.apsForgeService.urnify(apsFilesObject.objectId as any), fileObject.zipEntryPoint
            );
        console.log("apsUrnObj 2", apsUrnObj)
        const nameWihUrnKey = {
            apsObjKey: apsFilesObject.objectId,
            apsUrnKey: apsUrnObj.urn
        }
            
        return await this.fileModel.create({...fileObject, ...nameWihUrnKey});
      }

}