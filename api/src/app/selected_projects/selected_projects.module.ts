import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SelectedProject, ProjectSchema } from './selected_project.schema';
import { SelectedProjectResolver } from './selected_projects.resolver';
import { SelectedProjectService } from './selected_projects.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: SelectedProject.name, schema: ProjectSchema }])],
  providers: [SelectedProjectResolver, SelectedProjectService],
  exports: []
})
export class SelectedProjectModule {}
