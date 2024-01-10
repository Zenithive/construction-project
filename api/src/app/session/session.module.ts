/* The SessionModule class is a NestJS module that provides an interceptor for handling session
management using the express-session middleware. */

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import session from 'express-session';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => {
        return session({
          secret: 'F62BD3D2528833573EAA53AC9727C',
          resave: false,
          saveUninitialized: false,
        });
      },
    },
  ],
})
export class SessionModule {}