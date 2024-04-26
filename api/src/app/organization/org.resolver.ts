import { Resolver, Mutation, Query, Args } from '@nestjs/graphql'
import { OrgService } from './org.service'
import { Org, CreateOrgInput ,DeleteOrganisationInput,UpdateOrgInput,PaginationInputss,PaginationResultss} from './org.schema'


@Resolver()
export class OrgResolver {
  constructor(
    private orgService: OrgService,
  ) {}

  @Query(() => [Org])
  async getAllOrganisation() {
    return this.orgService.getAllOrganisation();
  }

  @Query(() => PaginationResultss)
  async getAllOrg(@Args('input') org:PaginationInputss) {
    return this.orgService.getAllOrg(org);
  }
 

  @Mutation(() => Org)
  async createOrg(@Args('input') org: CreateOrgInput) {
    return this.orgService.createOrg(org);
  }

  //for edit  and update org
  @Mutation(() => Org)
  async editOrg(@Args('input') org: UpdateOrgInput) {
    return this.orgService.editOrg(org);
  }

  @Mutation(()=>Org)
  async deleteOrganisation(@Args("input") org:DeleteOrganisationInput){
    return this.orgService.deleteOrganisation(org.orgId);
  }
}