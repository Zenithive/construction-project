import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Status,CreateNewStatus,GetStatus ,EditStatus,DeleteStatus} from './status.schema';
import { StatusService } from './status.service';
@Resolver()

export class StatusResolver{
    constructor(private statusService: StatusService) {}

    @Query(() => [Status])
    async getStatus(@Args('input') status: GetStatus) {
      return this.statusService.getStatus(status);
    }
  
    @Mutation(() => Status)
    async createNewStatus(@Args('input') status: CreateNewStatus) {
      return this.statusService.CreateNewStatus(status);
    }

    @Mutation(() => Status)
    async editStatus(@Args('input') status: EditStatus) {
      return this.statusService.editStatus(status);
    }

    
  @Mutation(() => Status)
  async deletestatus(@Args('input') status: DeleteStatus) {
    return this.statusService.deletestatus(status.statusId);
  }
}