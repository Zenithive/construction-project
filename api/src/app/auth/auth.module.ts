/* The SessionModule class is a NestJS module that provides an interceptor for handling session
management using the express-session middleware. */

import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthGuard } from './auth.guard';
import { JwtGuard } from './jwt.guard';

@Module({
  imports: [UserModule],
  providers: [AuthGuard, JwtGuard],
})
export class AuthModule {}