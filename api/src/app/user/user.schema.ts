import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { DEFAULT_VALUES } from '../Constants/defaultValues.constant';

export type UserDocument = User & Document;
@ObjectType()
export class Message {
  @Field()
  message!: string;
}

@Schema()
@ObjectType()
export class User {

  @Prop({ required: true })
  @Field()
  email!: string;

  @Prop()
  @Field()
  password!: string;

  @Prop({ required: true })
  @Field()
  lastName!: string;

  @Prop({ required: true })
  @Field()
  firstName!: string;

  @Prop()
  @Field()
  status!: string;

  @Prop()
  @Field()
  phoneNo!: string;

  @Prop()
  @Field()
  subscriptionId!: number;

  @Prop()
  @Field({defaultValue: new Date()})
  creationDate!: Date;

  @Prop()
  @Field({defaultValue: new Date()})
  updatedDate!: Date;

  @Prop()
  @Field()
  userId!: string;

  @Prop()
  @Field({defaultValue: false})
  emailVerified!: boolean;

  @Prop()
  @Field({defaultValue: true})
  isPasswordReset!: boolean;

}

@InputType()
export class CreateUserInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  lastName!: string;

  @Field({ nullable: true })
  firstName!: string;

  @Field({ nullable: true, defaultValue: DEFAULT_VALUES.userStatus })
  status!: string;

  @Field({defaultValue: new Date()})
  creationDate!: Date;

  @Field({ defaultValue: new Date() })
  updatedDate!: Date;

  @Field({ defaultValue: DEFAULT_VALUES.subscriptionId })
  subscriptionId!: number;

  @Field({ defaultValue: false })
  emailVerified!: boolean;

  @Field({ defaultValue: false })
  isPasswordReset!: boolean;  

  @Field()
  userId!: string;
}

@InputType()
export class CreateUserByAdmin {
  @Field({ nullable: true })
  email!: string;

  @Field({defaultValue:""})
  password!: string;

  @Field({ nullable: true })
  lastName!: string;

  @Field({ nullable: true })
  firstName!: string;

  @Field({defaultValue: DEFAULT_VALUES.userStatus})
  status!: string;

  @Field({ nullable: true })
  phoneNo!: string;

  @Field({ defaultValue: DEFAULT_VALUES.subscriptionId, nullable: true })
  subscriptionId!: number;

  @Field({defaultValue: new Date()})
  creationDate!: Date;

  @Field({defaultValue: new Date()})
  updatedDate!: Date;

  @Field()
  userId!: string;

  @Field({defaultValue: false})
  emailVerified!: boolean;

  @Field({defaultValue: true})
  isPasswordReset!: boolean;
}

@InputType()
export class UserId {
  @Field()
  _id!: string;
}

@InputType()
export class Email {
  @Field()
  email!: string;
}

@ObjectType()
export class ReturnUserObj {
  @Field()
  userId!: string;
  @Field()
  firstName!: string;
  @Field()
  lastName!: string;
  @Field()
  email!: string;
}
@ObjectType()
export class Token {
  @Field()
  token!: string;
  @Field()
  userObj!: ReturnUserObj;
}

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password!: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  _id!: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  status!: string;

  @Prop()
  @Field({ nullable: true })
  startDate!: Date;

  @Prop()
  @Field({ nullable: true })
  endDate!: Date;
}


// ##############    Sachin Edit 

@InputType()
export class DeleteUserInput {
  @Field()
  userId!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
