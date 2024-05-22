// file-upload.controller.ts
import { Controller, Get, Post, Param, Res, UseInterceptors,  UploadedFiles, Body, Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';

import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { FileService } from './file.service';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileService: FileService) { }


  @Post('upload')
  @UseInterceptors(FilesInterceptor('fileName', 10, multerOptions))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 @Get('downloadFile/:revisionId')
  async downloadFile(
    @Res() response: Response,
    @Param('revisionId') revisionId: string
  ) {
    try {
      const file = await this.fileService.getFileByParams({revisionId});
      if (file && file.fileId) {
        const filePath = join(
          '/app/server',
          file.fileName
        ); // Path to your uploaded files
        const stat = fs.statSync(filePath);

        response.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${file.originalname}"`,
          'Content-Length': stat.size,
        });

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(response);
      } else { console.log("File not found"); }

    } catch (error) {
      console.error('Error downloading file:', error);
      response.send('Error downloading file');
    }
  }

  @Get('renderPdfTronFile')
  async renderPdfTronFile(
    @Res() response: Response,
    @Query('id') id: string
  ) {
    try {
      const file = await this.fileService.getFileByParams({revisionId: id});
      if (file && file.fileId) {
        const filePath = join(file.path); 
       
        const stat = fs.statSync(filePath);
        const fileContentType = this.fileService.getFileContentType(filePath);
        response.writeHead(200, {
          'Content-Type': fileContentType,
          'Content-Disposition': `inline; filename="${file.originalname}"`,
          'Content-Length': stat.size,
        });

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(response);
      } else {
        console.log("File not found.");
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      response.send('Error downloading file');
    }
  }
}











