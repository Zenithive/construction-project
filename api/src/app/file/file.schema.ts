import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType} from '@nestjs/graphql';

export type FileDocument = File & Document;

@Schema()
@ObjectType()
export class File {

  @Prop({ required: true })
  @Field()
  fileId!: string;

  @Prop({ required: true })
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
  fileExtension!: string;

  @Prop()
  @Field()
  filePath!: string;

  @Prop()
  @Field()
  folderId!: string;

  @Prop()
  @Field()
  projectId!: string;

  @Prop()
  @Field()
  userId!: string;

  
}

@InputType()
export class UploadFileInput{

    @Field()
    fileName!: string;

    @Field()
    path!: string;

    @Field()
    projectId!: string;

    @Field()
    userId!: string;
}


export const FileSchema = SchemaFactory.createForClass(File);