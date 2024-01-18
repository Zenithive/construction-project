import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Prop({ required: true })
  @Field()
  _id!: string;

  @Prop({ required: true })
  @Field()
  email!: string;

  @Prop({ required: true })
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
  startDate!: Date;

  @Prop()
  @Field({ nullable: true })
  endDate!: Date;

  @Prop()
  @Field()
  adminId!: string;

}

@InputType()
export class CreateUserInput {
  @Field()
  _id!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  lastName!: string;

  @Field({ nullable: true })
  firstName!: string;

  @Field({ nullable: true })
  status!: string;

  @Prop()
  @Field()
  startDate: Date = new Date();

  @Prop()
  @Field({ nullable: true })
  endDate!: Date;

  @Field()
  adminId!: string;
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
  id!: string;
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

export const UserSchema = SchemaFactory.createForClass(User);
