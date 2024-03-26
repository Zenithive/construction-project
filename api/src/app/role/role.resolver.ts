import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { RoleService } from './role.service'
import { Role, CreateNewRole, GetRolesByProjId } from './role.schema'

@Resolver()
export class RoleResolver {
  constructor(
    private roleService: RoleService,
  ) {}

  @Query(() => [Role])
  async getRoles(@Args('input') role: GetRolesByProjId) {
    return this.roleService.getRole(role);
  }

  @Mutation(() => Role)
  async createNewRole(@Args('input') role: CreateNewRole) {
    return this.roleService.createNewRole(role);
  }

}