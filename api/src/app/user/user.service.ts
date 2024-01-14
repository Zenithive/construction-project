import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
//import { AppSession } from '../auth/session.types';
//import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { User, UserDocument, CreateUserInput, UserId, UpdateUserInput, LoginInput, Email, Token } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUsers() {
    return this.userModel.find()
  }

  async getUser(id: UserId) {
    return this.userModel.findOne({ _id: id })
  }

  async getUserByEmail(email: Email){
    const user: User | null = await this.userModel.findOne({ email : email })
    return user;
  } 

  async loginUser(LoginInput: LoginInput, user: User) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payLoad = {
      id : user._id,
      email : user.email,
    }
    const token = jwt.sign(payLoad,"secretKey",{expiresIn : "2h"});
    const tokenObj : Token = {
      token : token
    }
    console.log(token);
    return tokenObj;
  }

  async createUser(user: CreateUserInput) {
    const checkExistingUser = await this.userModel.findOne({ email: user.email });

    if(checkExistingUser){
      throw new Error('User with the same username or email already exists');
    }

    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);
    return this.userModel.create(user);
  }

  async updateUser(id: UserId, update: UpdateUserInput) {
    return this.userModel.findOneAndUpdate({ _id: id }, update, {
      new: true
    });
  }

  
}
