import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Org, OrgDocument, CreateOrgInput } from './org.schema';
import { v4 as uuidv4 } from 'uuid'; 


@Injectable()
export class OrgService {
    constructor(@InjectModel(Org.name) private orgModel: Model<OrgDocument>) {}

    async getAllOrg() {
        return this.orgModel.find();
      }

    async createOrg(org: CreateOrgInput){
        const checkExistingOrg = await this.orgModel.findOne({ orgName: org.orgName });
  
        if(checkExistingOrg){
          throw new Error('Org with the same Name Exists');
        }
        org.orgId = uuidv4()
        return this.orgModel.create(org);
      }

}