import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Status,CreateNewStatus,GetStatusByProjId } from './status.schema';
import { StatusService } from './status.service';
@Resolver()

export class StatusResolver{
    constructor(private statusService: StatusService) {}

    @Query(() => [Status])
    async getStatus(@Args('input') status: GetStatusByProjId) {
      return this.statusService.getStatus(status);
    }
  
    @Mutation(() => Status)
    async createNewStatus(@Args('input') status: CreateNewStatus) {
      return this.statusService.CreateNewStatus(status);
    }

}