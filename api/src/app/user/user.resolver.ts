import { Resolver, Query, Mutation, Args, Context, GraphQLExecutionContext } from '@nestjs/graphql'

import { User, CreateUserInput, UserId, UpdateUserInput, LoginInput, Email, Token, CreateUserByAdmin } from './user.schema';
import { UserService } from './user.service'
import { Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { Response } from 'express';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
  ) {}

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers()
  }

  @Query(() => User)
  async getUser(@Args('input') id:UserId) {
    return this.userService.getUser(id)
  }

  @Query(() => User)
  async getUserByEmail(@Args('input') email: Email) {
    return this.userService.getUserByEmail(email);
  }

  @Query(() => String)
  @UseGuards(JwtGuard)
 securedResource():string {
  return "This is secured Resouce";
  }

  @Mutation(() => User)
  async createUser(@Args('input') user: CreateUserInput) {
    return this.userService.createUser(user);
  }

  @Mutation(() => User)
  async createUserByAdmin(@Args('input') user: CreateUserByAdmin) {
    return this.userService.createUserByAdmin(user);
  }

  @Mutation(() => Token)
  @UseGuards(AuthGuard)
  async loginUser(@Args('input') loginData: LoginInput, @Context("user") user : User, @Context() context: GraphQLExecutionContext) {
    // @ts-ignore
    const response = context.req.res as Response;
    // context.getContext() .req.res as Response;
    const res = await this.userService.loginUser(loginData,user);
    response.cookie('tokenId', res.token, { 
      httpOnly: true, // Set security options as needed
      secure: true,   // Only send over HTTPS
     });
    return res;
  }

  @Mutation(() => User)
  async updateUser(@Args('input') id:UserId, @Args('input') user: UpdateUserInput) {
    return this.userService.updateUser(id, user);
  }

}
