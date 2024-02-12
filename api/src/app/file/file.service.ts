import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument, UploadFileInput } from './file.schema';
//import { FileStorageUtil } from '../util/file-storage.util';
import { v4 as uuidv4 } from 'uuid'; 
import * as path from 'path';



@Injectable()
export class FileService {
    constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}


    async uploadFile(fileObject: UploadFileInput){
        // const checkExistingFile = await this.fileModel.findOne({ fileName : fileObject.fileName });
  
        // if(checkExistingFile){
            
            return await this.fileModel.create(fileObject);
        // }

        // else{
        //     const filePath : string = fileObject.path;
        //     const fileId : string = uuidv4();
        //     const revisionId : string = uuidv4();
        //     const fileExtName : string = path.extname(fileObject.fileName);
        //     const newFile = new this.fileModel({
        //         fileId: fileId,
        //         revisionId: revisionId, 
        //         revision: 1, 
        //         fileName: fileObject.fileName,
        //         fileExtension: fileExtName, 
        //         filePath: filePath,
        //         folderId: "1",
        //         projectId: fileObject.projectId,
        //         userId: fileObject.userId,
        //     });

        //     return await newFile.save();
        // }


      }

}