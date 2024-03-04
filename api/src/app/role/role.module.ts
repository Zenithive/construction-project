import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';
import { Role, RoleSchema } from './role.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
    providers: [RoleResolver, RoleService],
    exports: []
})
export class RoleModule {}
