import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';
import { File, FileSchema } from './file.schema';
import { FileUploadController } from './file-upload.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
    providers: [FileResolver, FileService],
    controllers: [FileUploadController],
    exports: []
})
export class FileModule {}
