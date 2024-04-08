import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteFileInput, File, FileDocument, UploadFileInput } from './file.schema';
//import { FileStorageUtil } from '../util/file-storage.util';
import { ApsForgeService } from '../aps-forge/aps.forge.service';
import { FolderService } from '../folder/folder.service'
// import  {getFolderTreeIds} from '../folder/folder.service'






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
        const apsFilesObject = await this.apsForgeService.uploadObject(fileObject.originalname, fileObject.path);
        console.log("apsFilesObject 1", apsFilesObject)
        const apsUrnObj = await this.apsForgeService.translateObject(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.apsForgeService.urnify(apsFilesObject.objectId as any), fileObject.zipEntryPoint
        );
        console.log("apsUrnObj 2", apsUrnObj)
        const nameWihUrnKey = {
            apsObjKey: apsFilesObject.objectId,
            apsUrnKey: apsUrnObj.urn,

        }

        return await this.fileModel.create({ ...fileObject, ...nameWihUrnKey });
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

    async getFileByApsUrn(apsUrnKey: string) {

        return await this.fileModel.findOne({ apsUrnKey });

    }

    // async getFileByFolderId(folderId: string) {
    //     if (folderId) {
    //         return await this.fileModel.find({ folderId }).exec();
    //     }

    //     return this.fileModel.find({ status: { $ne: 'Inactive' } }).exec();
    // }


    async getFileByFolderId(folderId: string) {
        if (folderId) {
            const folderIds = await this.folderService.getFolderTreeIds(folderId); // Call
            // console.log("folderIds", folderIds)
            const files = await this.fileModel.find({ folderId: { $in: folderIds } }).exec();
            return files;
        }
        return this.fileModel.find({ status: { $ne: 'Inactive' } }).exec();
    }
}









