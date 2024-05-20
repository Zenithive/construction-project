import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatusDocument = Status & Document;

@Schema()
@ObjectType()
export class Status {

  @Prop()
  @Field()
  statusName!: string;

 @Prop()
 @Field()
 statusId!:string;

  @Prop()
  @Field()
  orgId!: string;

  @Prop()
  @Field()
  projId!: string;

  
  @Prop()
  @Field()
  userId!: string;
}

@InputType()
export class GetStatus {
  @Field()
  projId!: string;
}

@InputType()
export class CreateNewStatus {
  @Field()
  statusName!: string;

  @Field()
  statusId!: string;

  @Field({ nullable: true })
  userId!: string;

  @Field({ nullable: true })
  orgId!: string;

  @Field()
  projId!: string;

}

@InputType()
export class EditStatus {
  @Field()
  statusName?: string;

  @Field()
  statusId?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  orgId?: string;

  @Field()
  projId?: string;

}

@InputType()
export class DeleteStatus {
  @Field()
  statusId!: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);