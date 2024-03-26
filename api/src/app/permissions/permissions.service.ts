import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument, CreateNewPermission } from './permissions.schema';
import { v4 as uuidv4 } from 'uuid'; 
import { DEFAULT_PERMISSIONS } from '../Constants/permissions.constant';
import { Project } from '../project/project.schema';

@Injectable()
export class PermissionService {
    constructor(@InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>) {}

    async getPermissions() {
        return this.permissionModel.find();
      }

    async createNewPermissions(permissions: CreateNewPermission[]){
      return this.permissionModel.create(permissions);
    }

    async updatePermissions(permission: CreateNewPermission){
      const checkExistingProj = await this.permissionModel.findOne({ permissionId: permission.permissionId });

      if(checkExistingProj){
        throw new Error('Project with the same Name Exists');
      }
      permission.permissionId = uuidv4();
      return this.permissionModel.create(permission);
    }

    getNewPermissionsRecordsForNewProject(newProject:Project):CreateNewPermission[]{
      const permissionsRecors: CreateNewPermission[] = [];
      for (let index = 0; index < DEFAULT_PERMISSIONS.length; index++) {
        const element = DEFAULT_PERMISSIONS[index];
        const newPermission:CreateNewPermission = {} as CreateNewPermission;
        newPermission.permissionKey = element.key
        newPermission.permissionLabel = element.name
        newPermission.value = element.value
        newPermission.projId = newProject.projId;
        newPermission.orginatorId = newProject.orgId;
        newPermission.permissionId = uuidv4();
        newPermission.createdBy = new Date();
        newPermission.updatedBy = new Date();

        permissionsRecors.push(newPermission)
      }

      return permissionsRecors
    }
    
}