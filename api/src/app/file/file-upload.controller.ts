// file-upload.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';

import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { FileService } from './file.service';
import { error } from 'console';

@Controller('files')
export class FileUploadController {
  constructor(
    private readonly fileService: FileService,
    ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('fileName', multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('fileName', file);
    // You can return the file info or store it and return a reference
    const { filename } = file;
    const extension = filename.split('.')[filename.split('.').length - 1];
    return {
      originalName: file.originalname,
      fileName: file.filename,
      extension: extension,
      path: file.path,
      size: file.size,
      // folderId: file.folderId
    };
  }


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
      } else {
        console.log(error);
      }
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
        const filePath = join(
          '/app/server',
          file.fileName
        ); 
       
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
        console.log(error);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      response.send('Error downloading file');
    }
  }
}
