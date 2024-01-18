import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgResolver } from './org.resolver';
import { OrgService } from './org.service';
import { Org, OrgSchema } from './org.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }])],
    providers: [OrgResolver, OrgService],
    exports: []
})
export class OrgModule {}
