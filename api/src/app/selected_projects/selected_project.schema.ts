import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SelectedProjectDocument = SelectedProject & Document;

@Schema()
@ObjectType()
export class SelectedProject {
  @Prop({ required: true })
  @Field()
  projId!: string;

  @Prop({ required: true })
  @Field()
  projName!: string;

  @Prop({ required: true })
  @Field()
  userId!: string;
}

@InputType()
export class AddSelectedProjectInput {
  @Field()
  projId!: string;

  @Field()
  projName!: string;

  @Field()
  userId!: string;
}

@InputType()
export class RemoveSelectedProjectInput {
  @Field()
  projId!: string;

  @Field()
  userId!:string;
}

export const ProjectSchema = SchemaFactory.createForClass(SelectedProject);
