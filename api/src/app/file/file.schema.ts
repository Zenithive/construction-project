import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType} from '@nestjs/graphql';

export type FileDocument = File & Document;

@Schema()
@ObjectType()
export class File {

  @Prop()
  @Field()
  revisionId!: string;

  @Prop()
  @Field()
  revision!: number;

  @Prop()
  @Field()
  fileName!: string;

  @Prop()
  @Field()
  path!: string;

  @Prop()
  @Field()
  folderId!: string;

  @Prop()
  @Field()
  projectId!: string;

  @Prop()
  @Field()
  userId!: string;

  @Prop()
  @Field()
  orginatorId!: string;

  @Prop()
  @Field()
  extension!: string;

  @Prop()
  @Field()
  size!: number;

  @Prop()
  @Field()
  status!: string;    

  @Prop()
  @Field()
  docRef!: string;

  @Prop()
  @Field()
  originalname!: string;

}

@InputType()
export class UploadFileInput{

    @Field()
    fileName!: string;

    @Field()
    originalname!: string;

    @Field()
    path!: string;

    @Field()
    orginatorId!: string;

    @Field()
    extension!: string;

    @Field()
    size!: number;

    @Field()
    status!: string;    

    @Field()
    docRef!: string;

    @Field()
    revision!: string;

    @Field()
    projectId!: string;

    @Field()
    userId!: string;
}


export const FileSchema = SchemaFactory.createForClass(File);