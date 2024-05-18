import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Role,
  RoleDocument,
  CreateNewRole,
  GetRolesByProjId,
} from './role.schema';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../project/project.schema';
import { PermissionService } from '../permissions/permissions.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private permissionService: PermissionService
  ) {}

  // async getRoles() {
  //   return this.roleModel.find({status : {$ne:'Inactive'}})
  // }

  async getRole(role: GetRolesByProjId) {
    return this.roleModel.find({ projId: role.projId });
  }

  async createNewRole(role: CreateNewRole) {
    const checkExistingProj = await this.roleModel.findOne({
      roleName: role.roleName,
      projId: role.projId,
    });

    if (checkExistingProj) {
      throw new Error('Project with the same Name Exists');
    }
    role.roleId = uuidv4();
    const newRole = await this.roleModel.create(role);

    const projObj:Project = {
      projId: newRole.projId,
      orgId: newRole.projId,
      orginatorId: "",
      orgName: "",
      projName: "",
      region: "",
      status: "",
      website: ""
    }
    const preparePermissionData =
      this.permissionService.getNewPermissionsRecordsForNewProject(
        projObj,
        newRole
      );
    const insertAllPermissionRecord =
      await this.permissionService.createNewPermissions(preparePermissionData);
    if (insertAllPermissionRecord && insertAllPermissionRecord.length) {
      console.log('Project Permissions added');
      return newRole;
    } else {
      throw new Error(
        'Project created, but problems with project permissions!'
      );
    }
  }

  createDefaultAdminRoleForNewProject(newProject: Project) {
    const newAdminRole: CreateNewRole = {
      projId: newProject.projId,
      orgId: newProject.orgId,
      users: [],
      orginatorId: newProject.orginatorId,
      roleName: 'Admin',
      roleId: '',
      isDefaultRole: true,
    };
    return this.createNewRole(newAdminRole);
  }

  async deleterole(id: string) {
    const searchRole = {
      roleId: id,
    };
    return this.roleModel.findOneAndDelete(searchRole).exec();
  }

  async updaterole(id: string, users: string[]) {
    const update = [users];
    return this.roleModel
      .findOneAndUpdate({ roleId: id }, update, { new: true })
      .exec();
  }
}
