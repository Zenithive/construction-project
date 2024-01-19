import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType} from '@nestjs/graphql';

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
  @Field({ nullable: true })
  orgName!: string;

  @Prop()
  @Field({ nullable: true })
  orgId!: string;
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
}

export const OrgSchema = SchemaFactory.createForClass(Org);