import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { PermissionService } from './permissions.service'
import { Permission, CreateNewPermission, GetPermissionByProjId } from './permissions.schema'

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
  async updateUpermissions(@Args('input') permission: CreateNewPermission) {
    return this.permissionService.updatePermissions(permission);
  }

}