import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType,Int} from '@nestjs/graphql';
import { DEFAULT_VALUES } from '../Constants/defaultValues.constant';

export type OrgDocument = Org & Document;

@Schema()
@ObjectType()
export class Org {

  @Prop({ required: true })
  @Field()
  contact!: string;

  @Prop({ required: true })
  @Field()
  region!: string;

  @Prop()
  @Field()
  website!: string;

  @Prop()
  @Field({defaultValue: DEFAULT_VALUES.orgStatus})
  status!: string;

  @Prop()
  @Field({ nullable: true })
  orgName!: string;

  @Prop()
  @Field({ nullable: true })
  orgId!: string;

  @Prop()
  @Field({defaultValue: new Date()})
  creationDate!: Date;

  @Prop()
  @Field({defaultValue: new Date()})
  updatedDate!: Date;
}


@InputType()
export class CreateOrgInput {
  @Field()
  contact!: string;

  @Field()
  region!: string;

  @Field({ nullable: true })
  website!: string;

  @Field()
  orgId!: string;

  @Field()
  orgName!: string;

  @Field({defaultValue: DEFAULT_VALUES.orgStatus})
  status!: string;

  @Field({defaultValue: new Date()})
  creationDate!: Date;

  @Field({defaultValue: new Date()})
  updatedDate!: Date;
}

@InputType()
export class UpdateOrgInput {
  @Field()
  contact?: string;

  @Field()
  region?: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  orgId?: string;

  @Field()
  orgName?: string;

  @Field({defaultValue: DEFAULT_VALUES.orgStatus})
  status?: string;

  @Field({defaultValue: new Date()})
  creationDate?: Date;

  @Field({defaultValue: new Date()})
  updatedDate?: Date;
}

@ObjectType()
export class PaginationResultss {
  @Field(() => Int)
  totalOrgs!: number;

  @Field(() => Int)
  totalPages!: number;

  @Field(() => [Org])
  orgs!: Org[];
 
  @Field(() => Int)
  currentPage!: number;
}

@InputType()
export class PaginationInputss{
  @Prop()
  @Field()
  pageSize!: number;

  @Prop()
  @Field()
  currentPage!: number;
}

@InputType()
export class DeleteOrganisationInput{
  @Field()
  orgId!:string;
}

export const OrgSchema = SchemaFactory.createForClass(Org);