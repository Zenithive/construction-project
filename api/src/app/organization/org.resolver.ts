import { Resolver, Mutation, Query, Args } from '@nestjs/graphql'
import { OrgService } from './org.service'
import { Org, CreateOrgInput ,DeleteOrganisationInput} from './org.schema'


@Resolver()
export class OrgResolver {
  constructor(
    private orgService: OrgService,
  ) {}

  @Query(() => [Org])
  async getAllOrg() {
    return this.orgService.getAllOrg();
  }
 

  @Mutation(() => Org)
  async createOrg(@Args('input') org: CreateOrgInput) {
    return this.orgService.createOrg(org);
  }
  @Mutation(()=>Org)
  async deleteOrganisation(@Args("input") org:DeleteOrganisationInput){
    return this.orgService.deleteOrganisation(org.orgId);
  }
}