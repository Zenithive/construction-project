import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument, CreateNewRole } from './role.schema';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable()
export class RoleService {
    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

    async getRole() {
        return this.roleModel.find();
      }

    async createNewRole(role: CreateNewRole){
      const checkExistingProj = await this.roleModel.findOne({ roleName: role.roleName });

      if(checkExistingProj){
        throw new Error('Project with the same Name Exists');
      }
      role.roleId = uuidv4();
      return this.roleModel.create(role);
    }
}