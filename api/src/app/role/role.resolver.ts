import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoleService } from './role.service';
import {
  Role,
  CreateNewRole,
  GetRolesByProjId,
  DeleteRoleInput,
  UpdateRoleInputArray,
} from './role.schema';

@Resolver()
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  // @Query(() => [Role])
  // async getRole() {
  //   return this.roleService.getRoles()
  // }

  @Query(() => [Role])
  async getRoles(@Args('input') role: GetRolesByProjId) {
    return this.roleService.getRole(role);
  }

  @Mutation(() => Role)
  async createNewRole(@Args('input') role: CreateNewRole) {
    return this.roleService.createNewRole(role);
  }

  @Mutation(() => Role)
  async deleterole(@Args('input') role: DeleteRoleInput) {
    return this.roleService.deleterole(role.roleId);
  }
  @Mutation(() => [Role])
  async updateRole(@Args('input') role: UpdateRoleInputArray) {
    console.log(role)
    return this.roleService.getRole({projId: ""});
    //return this.roleService.updaterole(role.roleId, role.users);
  }
}
