import { ObjectType, Field, InputType} from '@nestjs/graphql';
import { DEFAULT_VALUES } from '../Constants/defaultValues.constant';

export type ApsForgeDocument = ApsForge;

@ObjectType()
export class ApsForge {

  @Field()
  contact!: string;

  @Field()
  region!: string;

  @Field()
  website!: string;

  @Field({defaultValue: DEFAULT_VALUES.orgStatus})
  status!: string;

  @Field({ nullable: true })
  orgName!: string;

  @Field({ nullable: true })
  orgId!: string;

  @Field({defaultValue: new Date()})
  creationDate!: Date;

  @Field({defaultValue: new Date()})
  updatedDate!: Date;
}


@InputType()
export class CreateApsForgeInput {
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

export const ApsForgeSchema = ApsForge;