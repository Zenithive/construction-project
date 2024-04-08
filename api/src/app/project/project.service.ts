import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument, CreateProjectInput,PaginationInput ,PaginationResult} from './project.schema';
import { v4 as uuidv4 } from 'uuid'; 
import { PermissionService } from '../permissions/permissions.service';
import { RoleService } from '../role/role.service';
import { Document } from 'mongoose';

@Injectable()
export class ProjectService {
    constructor(
      @InjectModel(Project.name) private projModel: Model<ProjectDocument>, 
      private permissionService: PermissionService,
      private roleService: RoleService
      ) {}

    // async getProjects() { // Modified by Sachin  on 16-02-2024 to filter out the inactive projects
    //     return this.projModel.find({ status: { $ne: 'Inactive' } });    
    //   }
    async getProjects(paginationInput: PaginationInput) {
      const { pageSize, currentPage } = paginationInput;
      const skip = pageSize * (currentPage - 1);
  
      const totalProjects = await this.projModel.countDocuments({ status: { $ne: 'Inactive' } });
      const totalPages = Math.ceil(totalProjects / pageSize);
  
      const projects = await this.projModel
          .find({ status: { $ne: 'Inactive' } })
          .skip(skip)
          .limit(pageSize)
          .exec();
  
      // Convert Mongoose documents to plain JavaScript objects
      const formattedProjects = projects.map((project: Document) => project.toObject() as Project);
  
      return {
          projects: formattedProjects,
          totalProjects,
          totalPages,
          currentPage,
      };
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

        // Create default Role: Admin
        const newRole = await this.roleService.createDefaultAdminRoleForNewProject(newProject);
        if(!(newRole && newRole.roleId)){
          throw new Error('Project created, but problems with project role!');
        }

        // Create default Permissions
        const preparePermissionData  = this.permissionService.getNewPermissionsRecordsForNewProject(newProject);
        const insertAllPermissionRecord  = await this.permissionService.createNewPermissions(preparePermissionData);
        if(insertAllPermissionRecord && insertAllPermissionRecord.length){
          console.log("Project Permissions added");
          return newProject;
        }else{
          throw new Error('Project created, but problems with project permissions!');
        }
      }else {
        throw new Error('Project not created, error with database!');
      }
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