import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { RoleService } from './role.service'
import { Role, CreateNewRole } from './role.schema'

@Resolver()
export class RoleResolver {
  constructor(
    private roleService: RoleService,
  ) {}

  @Query(() => [Role])
  async getRoles() {
    return this.roleService.getRole();
  }

  @Mutation(() => Role)
  async createNewRole(@Args('input') role: CreateNewRole) {
    return this.roleService.createNewRole(role);
  }

}