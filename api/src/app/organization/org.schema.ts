import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType} from '@nestjs/graphql';
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

export const OrgSchema = SchemaFactory.createForClass(Org);