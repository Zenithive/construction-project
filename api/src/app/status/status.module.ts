import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Status,StatusSchema } from './status.schema';
import { StatusResolver } from './status.resolver';
import { StatusService } from './status.service';
import { Permission, PermissionSchema } from '../permissions/permissions.schema';
import { PermissionService } from '../permissions/permissions.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Status.name, schema: StatusSchema },
        { name: Permission.name, schema: PermissionSchema },
    ])],
    providers: [StatusResolver, StatusService, PermissionService],
    exports: []
})
export class StatusModule {}