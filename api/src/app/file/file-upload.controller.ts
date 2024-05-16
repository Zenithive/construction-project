// file-upload.controller.ts
import { Controller, Get, Post, Param, Res, UseInterceptors, UploadedFile, UploadedFiles, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';

import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { FileService } from './file.service';
import { error } from 'console';
import { UploadFileInput } from './file.schema';





@Controller('files')
export class FileUploadController {
  constructor(private readonly fileService: FileService) { }

  @Post('upload') 
  @UseInterceptors(FilesInterceptor('fileName', 10, multerOptions)) // 'files' is the field name for multiple files
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {  
    console.log("fileName", files);
    // Process each file in the files array
    const uploadedFiles = files.map(file => ({
      originalName: file.originalname,
      fileName: file.filename,
      extension: file.filename.split('.').pop(), // Get file extension
      path: file.path,
      size: file.size,
    }));
    return uploadedFiles;
  }



  @Post('post')
  async saveFiles(@Body() files: Record<number, UploadFileInput>) {
    try {
      const savedFiles = [];
      for (const key in files) {
        if (files.hasOwnProperty(key)) {
          const file = files[key];
          const result = await this.fileService.uploadFile(file);
          savedFiles.push(result);
        }
      }
      return savedFiles;
    } catch (error) {
      console.error('Error saving files:', error);
      throw new Error('Error saving files');
    }
  }


  /// Code for download  file
  @Get("downloadFile/:apsUrnKey")
  async downloadFile(@Res() response: Response, @Param('apsUrnKey') apsUrnKey: string) {
    try {
      const file = await this.fileService.getFileByApsUrn(apsUrnKey); // Fetch file by apsUrnKey
      // console.log(file)
      if (file && file.fileId) {
        const filePath = join(__dirname, '../../', 'uploadedFiles', file.fileName); // Path to your uploaded files
        const stat = fs.statSync(filePath);

        response.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${file.originalname}"`,
          'Content-Length': stat.size,
        });

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(response);
      } else { console.log(error); }

    } catch (error) {
      console.error('Error downloading file:', error);
      response.send('Error downloading file');
    }
 }

 

 


 




}











