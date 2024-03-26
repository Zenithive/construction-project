import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Org, OrgDocument, CreateOrgInput,UpdateOrgInput} from './org.schema';
import { v4 as uuidv4 } from 'uuid'; 


@Injectable()
export class OrgService {
    constructor(@InjectModel(Org.name) private orgModel: Model<OrgDocument>) {}

    async getAllOrg() {
        return this.orgModel.find({status:{$ne:"Inactive"}});
      }
    
    async createOrg(org: CreateOrgInput){
        const checkExistingOrg = await this.orgModel.findOne({ orgName: org.orgName });
  
        if(checkExistingOrg){
          throw new Error('Org with the same Name Exists');
        }
        org.orgId = uuidv4()
        return this.orgModel.create(org);
      }

    async deleteOrganisation(id: string) {
            const searchObj = {
              orgId : id
            };
            const updateObj = {
              status: "Inactive"
            }
            return this.orgModel.findOneAndUpdate(searchObj, updateObj).exec();

}
async editOrg(org: UpdateOrgInput) {
  const existingOrg = await this.orgModel.findOneAndUpdate({ orgId: org.orgId },{
    $set:{
      contact: org.contact,
      region: org.region,
      website: org.website,
      orgName: org.orgName,
      status: org.status,
      updatedDate: org.updatedDate
    }
  }, { new: true });
  console.log(existingOrg);
  if (!existingOrg) {
    throw new Error('Organization not found');
  }
  return existingOrg.save();
}

}