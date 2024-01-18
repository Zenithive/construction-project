import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
//import { AppSession } from '../auth/session.types';
//import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 

import { User, UserDocument, CreateUserInput, UserId, UpdateUserInput, LoginInput, Email, Token, ReturnUserObj } from './user.schema';

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
   // const mail:string = email.email;
    const user: User | null = await this.userModel.findOne({ email : email })
    return user;
  } 

  async loginUser(LoginInput: LoginInput, user: User) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payLoad = {
      id : user._id,
      email : user.email,
    }
    console.log(user);
    const returnUser: ReturnUserObj = {
      id : user._id,
      firstName : user.firstName,
      lastName : user.lastName,
      email : user.email,
    }
    const token = jwt.sign(payLoad,"secretKey",{expiresIn : "2h"});
    const tokenObj : Token = {
      token : token,
      userObj : returnUser
    }
    console.log(tokenObj);
    return tokenObj;
  }

  async createUser(user: CreateUserInput) {
    const checkExistingUser = await this.userModel.findOne({ email: user.email });

    if(checkExistingUser){
      throw new Error('User with the same username or email already exists');
    }

    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);
    user._id = uuidv4()
    return this.userModel.create(user);
  }

  async updateUser(id: UserId, update: UpdateUserInput) {
    return this.userModel.findOneAndUpdate({ _id: id }, update, {
      new: true
    });
  }

  
}
