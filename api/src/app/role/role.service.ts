import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument, CreateNewRole, GetRolesByProjId } from './role.schema';
import { v4 as uuidv4 } from 'uuid'; 
import { Project } from '../project/project.schema';

@Injectable()
export class RoleService {
    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}
    
  // async getRoles() {
  //   return this.roleModel.find({status : {$ne:'Inactive'}})
  // }

    async getRole(role: GetRolesByProjId) {
        return this.roleModel.find({projId: role.projId});
      }

    async createNewRole(role: CreateNewRole){
      const checkExistingProj = await this.roleModel.findOne({ roleName: role.roleName, projId: role.projId });

      if(checkExistingProj){
        throw new Error('Project with the same Name Exists');
      }
      role.roleId = uuidv4();
      return this.roleModel.create(role);
    }

    createDefaultAdminRoleForNewProject(newProject:Project){
      const newAdminRole: CreateNewRole = {
        projId: newProject.projId,
        orgId: newProject.orgId,
        users: [],
        orginatorId: newProject.orginatorId,
        roleName: "Admin",
        roleId: "",
        isDefaultRole: true
      };
      return this.createNewRole(newAdminRole)
    };
    
    async deleterole(id: string) {
      const searchRole = {
        roleId: id
      };
      return this.roleModel.findOneAndDelete(searchRole).exec();
    };

    async updaterole(id: string, users: string[]) {
      const update = [users];
      return this.roleModel.findOneAndUpdate({ roleId: id }, update, { new: true }).exec();
    }
}