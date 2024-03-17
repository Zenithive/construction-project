import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionResolver } from './permissions.resolver';
import { PermissionService } from './permissions.service';
import { Permission, PermissionSchema } from './permissions.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
    providers: [PermissionResolver, PermissionService],
    exports: []
})
export class PermissionModule {}
