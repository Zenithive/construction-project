import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApsForgeService } from '../aps-forge/aps.forge.service';
import { Folder, FolderSchema } from './folder.schema';
import { FolderResolver } from './folder.resolver';
import { FolderService } from './folder.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }])],
    providers: [FolderResolver, FolderService, ApsForgeService],
    exports: []
})
export class FolderModule {}
