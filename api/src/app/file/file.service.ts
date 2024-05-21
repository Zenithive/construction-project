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
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import mime from 'mime';
import { APS_FORGE_CONFIG } from '../Constants/aps.forge.constant';


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
        const fileExt = fileObject.extension.toUpperCase();

        if(APS_FORGE_CONFIG.APS_VIEWER_SUPPORTED_FORMATS.indexOf(fileExt) > -1 || fileExt.indexOf("DWG") > -1 || fileExt.indexOf("RVT") > -1){

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

    async getFileByParams(Obj: {[key:string]: string | number}) {
        return await this.fileModel.findOne(Obj);
    }

    async getFileByFolderId(paginationInputF: PaginationInputF) {
        const { pageSize, currentPage, folderId } = paginationInputF;
        const skip = pageSize * (currentPage - 1);
        let query: any = { status: { $ne: 'Inactive' } }; //  logic for the folderId as it is also in input 
        if (folderId) {
            const folderIds = await this.folderService.getFolderTreeIds(folderId);
            query = {...query, folderId: { $in: folderIds } };
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


    getFileContentType(filePath: string) {
        const extension = path.extname(filePath).slice(1).toLowerCase();
        return mime.lookup(extension) || 'application/octet-stream';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    async saveFiles(filesData: any[]): Promise<File[]> {
        try {
            const getFileApsUrnKey = (fileObject:File) => {
                const fileExt = fileObject.extension.toUpperCase();
                return APS_FORGE_CONFIG.APS_VIEWER_SUPPORTED_FORMATS.indexOf(fileExt) > -1 || fileExt.indexOf("DWG") > -1 || fileExt.indexOf("RVT") > -1 ? "PENDING" : "";
            }
            const tmpData = filesData.map(file => ({
                revisionId: file.revisionId || uuidv4(),
                fileId: file.fileId || uuidv4(),
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
                apsUrnKey: getFileApsUrnKey(file),
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










