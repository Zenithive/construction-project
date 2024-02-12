// file-upload.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';

@Controller('files')
export class FileUploadController {

  @Post("upload")
  @UseInterceptors(FileInterceptor('fileName', multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log("fileName", file)
    // You can return the file info or store it and return a reference
    const {filename} = file;
    const extension = filename.split(".")[filename.split(".").length-1]
    return { 
        originalName: file.originalname,
        fileName: file.filename,
        extension: extension,
        path: file.path, 
        size: file.size,
    };
  } 
}
