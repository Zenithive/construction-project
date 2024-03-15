import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument, CreateProjectInput } from './project.schema';
import { v4 as uuidv4 } from 'uuid'; 

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
      project.projId = uuidv4()
      return this.projModel.create(project);
    }


    //Sachin code
    async deleteProject(id: string) {
      const searchObj = {
        projId : id
      };
      const updateObj = {
        status: "Inactive"
      }
      return this.projModel.findOneAndUpdate(searchObj, updateObj).exec();
  

      
    }
}