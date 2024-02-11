import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { join } from 'path';
import { ProjectModule } from './project/project.module';
import { OrgModule } from './organization/org.module';
import { ApsForgeModule } from './aps-forge/aps.forge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'api/src/schema.gql'),
      sortSchema: true,
    }),
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/rof'),
    AuthModule,
    UserModule,
    ProjectModule,
    OrgModule,
    ApsForgeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
