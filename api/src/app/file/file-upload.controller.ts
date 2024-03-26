// file-upload.controller.ts
import { Controller,Get,Post,Param,Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';

import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';


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

  

@Get("downloadFile")
downloadFile(@Res() response: Response) {
  const filePath = join(__dirname, '../../', 'uploadedFiles', "1710745187482-CSS Notes.pdf.pdf"); // Path to your uploaded files
      const stat = fs.statSync(filePath);


      response.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="CSS Notes.pdf"`,
        'Content-Length': stat.size,
      });

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(response);

}

}



/// Code for download  file     





