import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';
import { File, FileSchema } from './file.schema';
import { FileUploadController } from './file-upload.controller';
import { ApsForgeService } from '../aps-forge/aps.forge.service';
import { FolderService } from '../folder/folder.service';
import { Folder, FolderSchema } from '../folder/folder.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema },{ name: Folder.name, schema: FolderSchema }])],
    providers: [FileResolver, FileService, ApsForgeService, FolderService],
    controllers: [FileUploadController],
    exports: []
})
export class FileModule {}
