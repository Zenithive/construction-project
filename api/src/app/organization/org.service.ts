import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Org, OrgDocument, CreateOrgInput,UpdateOrgInput,PaginationInputss} from './org.schema';
import { v4 as uuidv4 } from 'uuid'; 
import { Document } from 'mongoose';


@Injectable()
export class OrgService {
    constructor(@InjectModel(Org.name) private orgModel: Model<OrgDocument>) {}

    
    async getAllOrganisation(){
      return this.orgModel.find().exec();
  }

    async getAllOrg(paginationInput: PaginationInputss) {
      try {
          const { pageSize, currentPage } = paginationInput;
          const skip = pageSize * (currentPage - 1);
  
          const totalOrgs = await this.orgModel.countDocuments({ status: { $ne: 'Inactive' } });
          const totalPages = Math.ceil(totalOrgs / pageSize);
  
          const orgs = await this.orgModel
              .find({ status: { $ne: 'Inactive' } })
              .skip(skip)
              .limit(pageSize)
              .exec();
  
          // Ensure orgs is never null, even if no organizations found
          const formattedOrgs = orgs.map((org: Document) => org.toObject() as Org) || [];
  
          return {
              orgs: formattedOrgs,
              totalOrgs,
              totalPages,
              currentPage,
          };
      } catch (error) {
          // Handle any errors that occur during data fetching
          console.error("Error fetching organizations:", error);
          throw new Error("Failed to fetch organizations");
      }
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