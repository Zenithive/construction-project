import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';

import { join } from 'path';
import { ProjectModule } from './project/project.module';
import { OrgModule } from './organization/org.module';
import { ApsForgeModule } from './aps-forge/aps.forge.module';
import { FolderModule } from './folder/folder.module';
import { RoleModule } from './role/role.module';

const { DB_NAME, MONGO_URL } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'api/src/schema.gql'),
      sortSchema: true,
      //context: ({ req, res }) => ({ req, res }),
      playground: {
        settings: {
          "request.credentials": "include", // Otherwise cookies won't be sent
        }
      },
    }),
    MongooseModule.forRoot(`${MONGO_URL}/${DB_NAME}`),
    AuthModule,
    UserModule,
    ProjectModule,
    OrgModule,
    FileModule,
    ApsForgeModule,
    FolderModule,
    RoleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
