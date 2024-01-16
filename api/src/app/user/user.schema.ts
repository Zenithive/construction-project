import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Prop()
  @Field(() => ID)
  _id!: number;

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
}

@InputType()
export class CreateUserInput {
  @Field(() => ID)
  _id!: number;

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
}

@InputType()
export class UserId {
  @Field(() => ID)
  _id!: number;
}

@InputType()
export class Email {
  @Field()
  email!: string;
}

@ObjectType()
export class Token {
  @Field()
  token!: string;
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
  @Field(() => ID)
  _id!: number;

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
