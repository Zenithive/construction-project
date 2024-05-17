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

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileService: FileService) { }

  // ******** Upload request for Modal 1 ******** //

  @Post('upload')
  @UseInterceptors(FilesInterceptor('fileName', 10, multerOptions))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    // console.log("fileName", files);
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

  // ******** Post request for Modal 2 ******** //

  @Post('post')
  async saveFiles(@Body() filesData: any[]) {
    try {
      const savedFiles = await this.fileService.saveFiles(filesData);
      return savedFiles;
    } catch (error) {
      console.error('Error saving files:', error);
      throw new Error('Error saving files');
    }
  }

  // ******** Get request for download ******** //

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











