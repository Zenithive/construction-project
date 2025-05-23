import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Status,CreateNewStatus, StatusDocument,GetStatus,EditStatus } from './status.schema';
import { v4 as uuidv4 } from 'uuid';
import { PermissionService } from '../permissions/permissions.service';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name) private statusModel: Model<StatusDocument>,
    private permissionService: PermissionService
  ) {}

  async getStatus(status: GetStatus) {
    return this.statusModel.find({ projId: status.projId });
  }

  async CreateNewStatus(statusData: CreateNewStatus): Promise<Status> {
    const { statusName, userId, orgId, projId } = statusData;

    const existingStatus = await this.statusModel.findOne({ statusName, projId ,orgId,userId});
    if (existingStatus) {
      throw new Error('A status with the same name already exists.');
    }

    const statusId = uuidv4();

    const newStatus = new this.statusModel({
      statusName,
      statusId,
      userId,
      orgId,
      projId
    });


    const savedStatus = await newStatus.save();
    return savedStatus;
  }

  async editStatus(statusData: EditStatus): Promise<Status> {
    const { statusId, statusName, userId, orgId, projId } = statusData;

    const updatedStatus = await this.statusModel.findOneAndUpdate(
      { statusId },
      { statusName, userId, orgId, projId },
      { new: true } 
    );

    if (!updatedStatus) {
      throw new Error('Status not found');
    }

    return updatedStatus;
  }

  async deletestatus(id: string) {
    const searchStatus = {
      statusId: id,
    };
    return this.statusModel.findOneAndDelete(searchStatus).exec();
  }

}