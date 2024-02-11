import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';
import { File, FileSchema } from './file.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
    providers: [FileResolver, FileService],
    exports: []
})
export class FileModule {}
