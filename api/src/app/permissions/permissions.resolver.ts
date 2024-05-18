import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { PermissionService } from './permissions.service'
import { Permission, GetPermissionByProjId, UpdatePermission } from './permissions.schema'

@Resolver()
export class PermissionResolver {
  constructor(
    private permissionService: PermissionService,
  ) {}

  @Query(() => [Permission])
  async getPermissions(@Args('input') projIdObj: GetPermissionByProjId) {
    return this.permissionService.getPermissions(projIdObj);
  }

  @Mutation(() => Permission)
  async updatePermission(@Args('input') permission: UpdatePermission) {
    return this.permissionService.updatePermissions(permission);
  }

}