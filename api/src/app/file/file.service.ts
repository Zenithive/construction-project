import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteFileInput, File, FileDocument, PaginationInputF, UploadFileInput } from './file.schema';
//import { FileStorageUtil } from '../util/file-storage.util';
import { ApsForgeService } from '../aps-forge/aps.forge.service';
import { FolderService } from '../folder/folder.service'
// import  {getFolderTreeIds} from '../folder/folder.service'
import { Document } from 'mongoose';
import { UserId } from '../user/user.schema';

@Injectable()
export class FileService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        private apsForgeService: ApsForgeService,
        private folderService: FolderService, // Inject FolderService
    ) { }

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

    async getFileByFolderId(paginationInputF: PaginationInputF) {
        const { pageSize, currentPage, folderId } = paginationInputF;
        const skip = pageSize * (currentPage - 1);
        let query = {}; //  logic for the folderId as it is also in input 
        if (folderId) {
            const folderIds = await this.folderService.getFolderTreeIds(folderId);
            query = { folderId: { $in: folderIds } };
        } else {
            query = { status: { $ne: 'Inactive' } };
        }

        const totalFiles = await this.fileModel.countDocuments(query);
        const totalPages = Math.ceil(totalFiles / pageSize);

        const files = await this.fileModel
            .find(query)
            .skip(skip)
            .limit(pageSize)
            .exec();

        // Convert Mongoose documents to plain JavaScript objects
        const formattedFiles = files.map((file: Document) => file.toObject() as File);

        return {
            files: formattedFiles,
            totalFiles,
            totalPages,
            currentPage,
        };
    }

    // async saveFiles(filesData: any[]): Promise<[File]> {
    //     try {
    //         const tmpData = [];
    //         for (const key in filesData) {
    //             if (Object.prototype.hasOwnProperty.call(filesData, key)) {
    //                 const element = filesData[key];
    //                 tmpData.push(element);
    //             }
    //         }
    //         // console.log("filesDatas", filesData);
    //         console.log("tmpData", tmpData);
    //         const savedFiles: any = await this.fileModel.insertMany(tmpData);

    //         return savedFiles;
    //     } catch (error) {
    //         console.error('Error saving files:', error);
    //         throw new Error('Error saving files');
    //     }
    // }

    async saveFiles(filesData: any[]): Promise<File[]> {
        try {
            const tmpData = filesData.map(file => ({
                revisionId: file.revisionId || null,
                fileId: file.fileId || null,
                revision: file.revision,
                fileName: file.fileName,
                path: file.path,
                folderId: file.folderId,
                projectId: file.projectId,
                userId: file.userId,
                orginatorId: file.orginatorId,
                extension: file.extension,
                size: file.size,
                status: file.status,
                docRef: file.docRef,
                originalname: file.originalName,
                zipEntryPoint: file.zipEntryPoint || "",
                apsUrnKey: file.apsUrnKey || "",
                apsObjKey: file.apsObjKey || ""
            }));

            const savedFiles = await this.fileModel.insertMany(tmpData);
            return savedFiles;
        } catch (error) {
            console.error('Error saving files:', error);
            throw new Error('Error saving files');
        }
    }
}










