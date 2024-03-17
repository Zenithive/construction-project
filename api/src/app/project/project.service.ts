import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument, CreateProjectInput } from './project.schema';
import { v4 as uuidv4 } from 'uuid'; 
import { PermissionService } from '../permissions/permissions.service';

@Injectable()
export class ProjectService {
    constructor(@InjectModel(Project.name) private projModel: Model<ProjectDocument>, private permissionService: PermissionService) {}

    async getProjects() {
        return this.projModel.find();
      }

    async createProject(project: CreateProjectInput){
      const checkExistingProj = await this.projModel.findOne({ projName: project.projName });

      if(checkExistingProj){
        throw new Error('Project with the same Name Exists');
      }
      project.projId = uuidv4()
      
      // create a Project
      const newProject = await this.projModel.create(project);
      if(newProject && newProject.projId) {
        console.log("Project Created");

        // Create default Permissions
        const preparePermissionData  = this.permissionService.getNewPermissionsRecordsForNewProject(newProject);
        const insertAllPermissionRecord  = await this.permissionService.createNewPermissions(preparePermissionData);
        if(insertAllPermissionRecord && insertAllPermissionRecord.length){
          console.log("Project Permissions added");
          return newProject;
        }else{
          throw new Error('Project created, but probles with project permissions!');
        }
      }else {
        throw new Error('Project not created, error with database!');
      }
    }
}