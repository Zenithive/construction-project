import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument, UploadFileInput } from './file.schema';
//import { FileStorageUtil } from '../util/file-storage.util';
import { ApsForgeService } from '../aps-forge/aps.forge.service';
import { FolderService } from '../folder/folder.service'
import mime from 'mime';
import path from 'path';
import { APS_FORGE_CONFIG } from '../Constants/aps.forge.constant';
// import  {getFolderTreeIds} from '../folder/folder.service'



interface FileSearchParam{
    [key: string] : string | number;
}


@Injectable()
export class FileService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        private apsForgeService: ApsForgeService,
        private folderService: FolderService, // Inject FolderService
    ) {

    }

    async getFiles() {
        return this.fileModel.find({ status: { $ne: 'Inactive' } }).exec();
    }


    async uploadFile(fileObject: UploadFileInput) {
        const fileExt = fileObject.extension.toUpperCase();

        if(APS_FORGE_CONFIG.APS_VIEWER_SUPPORTED_FORMATS.indexOf(fileExt) > -1 || fileExt.indexOf("DWG") > -1 || fileExt.indexOf("RVT") > -1){
            // const apsFilesObject = await this.apsForgeService.uploadObject(fileObject.originalname, fileObject.path);
            // console.log("apsFilesObject 1", apsFilesObject)
            // const apsUrnObj = await this.apsForgeService.translateObject(
            //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //     this.apsForgeService.urnify(apsFilesObject.objectId as any), fileObject.zipEntryPoint
            // );
            // console.log("apsUrnObj 2", apsUrnObj)
            // const nameWihUrnKey = {
            //     apsObjKey: apsFilesObject.objectId,
            //     apsUrnKey: apsUrnObj.urn,
    
            // }

            const nameWihUrnKey = {
                apsUrnKey: "PENDING",
            }
            return await this.fileModel.create({ ...fileObject, ...nameWihUrnKey });
        }

        return await this.fileModel.create({ ...fileObject });
    }

    async generateApsUrnKey(fileId: string){
        const searchObj = { fileId };
        const fileObject = await this.getFileByParams(searchObj);
        if(fileObject && fileObject.fileId){
            if(fileObject.apsUrnKey === "PENDING"){
                const apsFilesObject = await this.apsForgeService.uploadObject(fileObject.originalname, fileObject.path);
                console.log("apsFilesObject 1", apsFilesObject)
                const apsUrnObj = await this.apsForgeService.translateObject(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.apsForgeService.urnify(apsFilesObject.objectId as any), fileObject.zipEntryPoint
                );
                console.log("apsUrnObj 2", apsUrnObj)
                const updatedUrnKey = {
                    apsObjKey: apsFilesObject.objectId,
                    apsUrnKey: apsUrnObj.urn,
        
                }
                return await this.fileModel.findOneAndUpdate(searchObj, updatedUrnKey).exec();
            }else {
                throw({"error": "File has already generated URN key."})
            }
        }else{
            throw({"Error": "File not found to generate URN key."})
        }
    }

    async deleteFile(fileId: string) {

        const searchObj = {
            fileId: fileId
        };
        const updateObj = {
            status: "Inactive"
        }

        return this.fileModel.findOneAndUpdate(searchObj, updateObj).exec();
    }

    async getFileByParams(fileObject:FileSearchParam) {
        return await this.fileModel.findOne(fileObject);
    }

    getFileContentType(filePath: string) {
        //const mime = require('mime-types'); // Use a reliable mime-type library
        const extension = path.extname(filePath).slice(1).toLowerCase();
        return mime.lookup(extension) || 'application/octet-stream'; // Default to octet-stream
    }


    async getFileByFolderId(folderId: string) {
        if (folderId) {
            const folderIds = await this.folderService.getFolderTreeIds(folderId);
            const files = await this.fileModel.find({ folderId: { $in: folderIds } }).exec();
            return files;
        }
        return this.fileModel.find({ status: { $ne: 'Inactive' } }).exec();
    }
}









