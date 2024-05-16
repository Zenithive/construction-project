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

  @Prop()
  @Field(() => Boolean,{nullable: true, defaultValue: false})
  isDefaultRole!: boolean;
}

@InputType()
export class GetRolesByProjId {
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

  @Field(() => Boolean,{nullable: true, defaultValue: false})
  isDefaultRole!: boolean;
}

@InputType()
export class DeleteRoleInput {
  @Field()
  roleId!: string;
}

@InputType()
export class UpdateRoleInput {
  @Field(() => String)
  roleId!: string;

  @Field(() => [UserIdz])
  userIds!: UserIdz[];
}

@InputType()
export class UserIdz {
  @Field(() => String)
  usrId!: string;
}

@InputType()
export class UpdateRoleInputArray {
  @Field(() => [UpdateRoleInput],{nullable: true})
  allRolesData!: UpdateRoleInput[];
}
export const RoleSchema = SchemaFactory.createForClass(Role);