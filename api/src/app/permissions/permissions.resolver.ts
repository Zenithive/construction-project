import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { PermissionService } from './permissions.service'
import { Permission, CreateNewPermission } from './permissions.schema'

@Resolver()
export class PermissionResolver {
  constructor(
    private permissionService: PermissionService,
  ) {}

  @Query(() => [Permission])
  async getPermissions() {
    return this.permissionService.getPermissions();
  }

  @Mutation(() => Permission)
  async updateUpermissions(@Args('input') permission: CreateNewPermission) {
    return this.permissionService.updatePermissions(permission);
  }

}