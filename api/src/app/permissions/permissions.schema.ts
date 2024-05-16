import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType} from '@nestjs/graphql';

export type PermissionDocument = Permission & Document;

@Schema()
@ObjectType()
export class Permission {

  @Prop({ required: true })
  @Field()
  permissionLabel!: string;

  @Prop({ required: true })
  @Field()
  permissionKey!: string;

  @Prop()
  @Field()
  permissionId!: string;

  @Prop()
  @Field()
  orginatorId!: string;

  @Prop()
  @Field()
  roleId!: string;

  @Prop()
  @Field()
  value!: boolean;

  @Prop()
  @Field()
  createdBy: Date = new Date();

  @Prop()
  @Field()
  updatedBy: Date = new Date();;

  @Prop()
  @Field()
  projId!: string;
}

@InputType()
export class CreateNewPermission {

  @Field()
  permissionLabel!: string;

  @Field()
  permissionKey!: string;

  @Field()
  permissionId!: string;

  @Field()
  orginatorId!: string;

  @Field()
  value!: boolean;

  @Field()
  createdBy: Date = new Date();

  @Field()
  updatedBy: Date = new Date();;

  @Field()
  projId!: string;

  @Field()
  roleId!: string;
}

@InputType()
export class UpdatePermission {

  @Field()
  permissionId!: string;

  @Field()
  value!: boolean;

  @Field()
  updatedBy: Date = new Date();

  @Field()
  roleId!: string;

  @Field()
  orginatorId!: string;
}

@InputType()
export class GetPermissionByProjId {
  @Field()
  projId!: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);