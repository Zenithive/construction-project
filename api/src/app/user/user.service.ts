import { Model } from 'mongoose';
import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
//import { AppSession } from '../auth/session.types';
//import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 
import { Document } from 'mongoose';

import { User, UserDocument, CreateUserInput, UserId, UpdateUserInput, LoginInput, Email, Token, CreateUserByAdmin,EditUserByAdmin ,PaginationInputs} from './user.schema';


@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // async getUsers() {
  //   return this.userModel.find({status : {$ne:'Inactive'}})
  // }
  async getUsers(paginationInput: PaginationInputs) {
    try {
        const { pageSize, currentPage } = paginationInput;
        const skip = pageSize * (currentPage - 1);

        const totalUsers = await this.userModel.countDocuments({ status: { $ne: 'Inactive' } });
        const totalPages = Math.ceil(totalUsers / pageSize);

        const users = await this.userModel
            .find({ status: { $ne: 'Inactive' } })
            .skip(skip)
            .limit(pageSize)
            .exec();

        // Ensure users is never null, even if no users found
        const formattedUsers = users.map((user: Document) => user.toObject() as User) || [];

        return {
            users: formattedUsers,
            totalUsers,
            totalPages,
            currentPage,
        };
    } catch (error) {
        // Handle any errors that occur during data fetching
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
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
    const payLoad = {
      email : user.email,
    }
    const token = jwt.sign(payLoad,"secretKey",{expiresIn : "2h"});
    const tokenObj : Token = {
      token : token,
      userObj : {
        userId : user.userId,
        firstName : user.firstName,
        lastName : user.lastName,
        email : user.email,
      }
    }
    return tokenObj;
  }

  async createUser(user: CreateUserInput) {
    const checkExistingUser = await this.userModel.findOne({ email: user.email });

    if(checkExistingUser){
      throw new Error('User with the same username or email already exists');
    }

    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);
    user.userId = uuidv4()
    return this.userModel.create(user);
  }

  async createUserByAdmin(user: CreateUserByAdmin) {
    const checkExistingUser = await this.userModel.findOne({ email: user.email });

    if(checkExistingUser){
      throw new Error('User with the same username or email already exists');
    }
    
    user.userId = uuidv4()
    return this.userModel.create(user);
  }
  async editUser(user: EditUserByAdmin) {
    const existinguser = await this.userModel.findOneAndUpdate({ userId: user.userId },{
      $set:{
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        phoneNo: user.phoneNo,
        subscriptionId: user.subscriptionId,
        updatedDate: user.updatedDate,
        emailVerified:user.emailVerified,
        isPasswordReset:user.isPasswordReset 
      }
    }, { new: true });
    console.log(existinguser);
    if (!existinguser) {
      throw new Error('Organization not found');
    }
    return existinguser.save();
  }

  async updateUser(id: UserId, update: UpdateUserInput) {
    return this.userModel.findOneAndUpdate({ _id: id }, update, {
      new: true
    });
  }


// (*************************) Sachin Code (modified )
  async deleteUser(id: string) {
    const searchUser = {
      userId: id
    };
    
    const UpdateUser = {
      status: 'Inactive'
    }

    return this.userModel.findOneAndUpdate(searchUser, UpdateUser).exec();


  }

  

  
}
