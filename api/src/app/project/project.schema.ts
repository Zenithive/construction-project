import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, InputType} from '@nestjs/graphql';

export type ProjectDocument = Project & Document;

@Schema()
@ObjectType()
export class Project {
  @Prop()
  @Field(() => ID)
  _id!: number;

  @Prop({ required: true })
  @Field()
  projName!: string;

  @Prop({ required: true })
  @Field()
  region!: string;

  @Prop({ required: true })
  @Field()
  status!: string;

  @Prop()
  @Field()
  website!: string;
}

@InputType()
export class CreateProjectInput {
  @Field(() => ID)
  _id!: number;

  @Field()
  projName!: string;

  @Field()
  region!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  website!: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);