import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument, CreateUserInput, UserId, UpdateUserInput, LoginInput } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUsers() {
    return this.userModel.find()
  }

  async getUser(id: UserId) {
    return this.userModel.findOne({ _id: id })
  }

  async loginUser(LoginInput: LoginInput) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData: User | null = await this.userModel.findOne({ email: LoginInput.email })
    if (!userData) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(LoginInput.password, userData.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return userData;

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
