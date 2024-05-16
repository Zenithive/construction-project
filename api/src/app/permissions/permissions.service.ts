import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument, CreateNewPermission, GetPermissionByProjId, UpdatePermission } from './permissions.schema';
import { v4 as uuidv4 } from 'uuid'; 
import { DEFAULT_PERMISSIONS } from '../Constants/permissions.constant';
import { Project } from '../project/project.schema';
import { Role } from '../role/role.schema';

@Injectable()
export class PermissionService {
    constructor(@InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>) {}

    async getPermissions(projIdObj: GetPermissionByProjId) {
        return this.permissionModel.find({projId: projIdObj.projId});
      }

    async createNewPermissions(permissions: CreateNewPermission[]){
      return this.permissionModel.create(permissions);
    }

    async updatePermissions(permission: UpdatePermission){
      const existingPermission = await this.permissionModel.findOneAndUpdate({ 
        permissionId: permission.permissionId,
        roleId: permission.roleId
       },{
        $set:{
          value: permission.value,
          orginatorId: permission.orginatorId
        }
      }, { new: true });

      if (!existingPermission) {
        throw new Error('Permission not found for Update');
      }
      return existingPermission.save();
    }

    getNewPermissionsRecordsForNewProject(newProject:Project, roleObj: Role):CreateNewPermission[]{
      const permissionsRecors: CreateNewPermission[] = [];
      for (let index = 0; index < DEFAULT_PERMISSIONS.length; index++) {
        const element = DEFAULT_PERMISSIONS[index];
        const newPermission:CreateNewPermission = {} as CreateNewPermission;
        newPermission.permissionKey = element.key
        newPermission.permissionLabel = element.name
        newPermission.value = element.value
        newPermission.projId = newProject.projId;
        newPermission.orginatorId = newProject.orgId;
        newPermission.roleId = roleObj.roleId;
        
        newPermission.permissionId = uuidv4();
        newPermission.createdBy = new Date();
        newPermission.updatedBy = new Date();

        permissionsRecors.push(newPermission)
      }

      return permissionsRecors
    }
    
}