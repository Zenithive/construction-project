import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from './project.schema';
import { PermissionService } from '../permissions/permissions.service';
import { Permission, PermissionSchema } from '../permissions/permissions.schema';
import { Role, RoleSchema } from '../role/role.schema';
import { RoleService } from '../role/role.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Project.name, schema: ProjectSchema }, 
        { name: Permission.name, schema: PermissionSchema },
        { name: Role.name, schema: RoleSchema }
    ])],
    providers: [ProjectResolver, ProjectService, PermissionService, RoleService],
    exports: []
})
export class ProjectModule {}
