import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';
import { Role, RoleSchema } from './role.schema';
import { Permission, PermissionSchema } from '../permissions/permissions.schema';
import { PermissionService } from '../permissions/permissions.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Role.name, schema: RoleSchema },
        { name: Permission.name, schema: PermissionSchema },
    ])],
    providers: [RoleResolver, RoleService, PermissionService],
    exports: []
})
export class RoleModule {}
