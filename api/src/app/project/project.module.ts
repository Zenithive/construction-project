import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from './project.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])],
    providers: [ProjectResolver, ProjectService],
    exports: []
})
export class ProjectModule {}
