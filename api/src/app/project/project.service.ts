import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument, CreateProjectInput } from './project.schema';

@Injectable()
export class ProjectService {
    constructor(@InjectModel(Project.name) private projModel: Model<ProjectDocument>) {}

    async getProjects() {
        return this.projModel.find();
      }

    async createProject(project: CreateProjectInput){
        const checkExistingProj = await this.projModel.findOne({ projName: project.projName });

    if(checkExistingProj){
      throw new Error('Project with the same Name Exists');
    }
    return this.projModel.create(project);
    }
}