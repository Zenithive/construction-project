import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType} from '@nestjs/graphql';

export type RoleDocument = Role & Document;

@Schema()
@ObjectType()
export class Role {

  @Prop({ required: true })
  @Field()
  roleName!: string;

  @Prop()
  @Field()
  roleId!: string;

  @Prop()
  @Field()
  orginatorId!: string;

  @Prop()
  @Field(() => [String],{nullable: true, defaultValue: []})
  users!: string[];

  @Prop()
  @Field()
  orgId!: string;

  @Prop()
  @Field()
  projId!: string;
}

@InputType()
export class CreateNewRole {
  @Field()
  roleName!: string;

  @Field()
  roleId!: string;

  @Field()
  orginatorId!: string;

  @Field(() => [String],{nullable: true, defaultValue: []})
  users!: string[];

  @Field({ nullable: true })
  orgId!: string;

  @Field()
  projId!: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);