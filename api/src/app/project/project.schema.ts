import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType,Int} from '@nestjs/graphql';

export type ProjectDocument = Project & Document;

@Schema()
@ObjectType()
export class Project {
  @Prop()
  @Field()
  projId!: string;

  @Prop({ required: true })
  @Field()
  projName!: string;

  @Prop({ required: true })
  @Field()
  region!: string;

  @Prop({ required: true })
  @Field()
  orginatorId!: string;

  @Prop({ required: true })
  @Field()
  status!: string;

  @Prop()
  @Field()
  website!: string;

  @Prop()
  @Field({ nullable: true })
  orgName!: string;

  @Prop()
  @Field({ nullable: true })
  orgId!: string;


}

@ObjectType()
export class PaginationResult {
  @Field(() => Int)
  totalProjects!: number;

  @Field(() => Int)
  totalPages!: number;

  @Field(() => [Project])
  projects!: Project[];
 
  @Field(() => Int)
  currentPage!: number;
}

@InputType()
export class PaginationInput{
  @Prop()
  @Field()
  pageSize!: number;

  @Prop()
  @Field()
  currentPage!: number;
}

@InputType()
export class DeleteProjectInput {
  @Field()
  projId!: string;
}

@InputType()
export class CreateProjectInput {
  @Field()
  projId!: string;

  @Field()
  projName!: string;

  @Field()
  orginatorId!: string;

  @Field()
  region!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  website!: string;

  @Field()
  orgId!: string;

  @Field()
  orgName!: string;
}



export const ProjectSchema = SchemaFactory.createForClass(Project);