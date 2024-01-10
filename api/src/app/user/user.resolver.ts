import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { Request } from 'express';
import { User, CreateUserInput, UserId, UpdateUserInput, LoginInput } from './user.schema';
import { AppSession } from '../session/session.types';
import { UserService } from './user.service'

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

  @Mutation(() => User)
  async createUser(@Args('input') user: CreateUserInput) {
    return this.userService.createUser(user);
  }

  @Mutation(() => User)
  async loginUser(@Context('req') req:Request, @Args('input') loginData: LoginInput) {
    return this.userService.loginUser(req.session as AppSession, loginData);
  }

  @Mutation(() => User)
  async updateUser(@Args('input') id:UserId, @Args('input') user: UpdateUserInput) {
    return this.userService.updateUser(id, user);
  }

}
