import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType, Int } from '@nestjs/graphql';


export type FileDocument = File & Document;

@Schema()
@ObjectType()
export class File {

  @Prop()
  @Field({ nullable: true })
  revisionId!: string;

  @Prop()
  @Field({ nullable: true })
  fileId!: string;

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

  @Prop({nullable: true})
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

  @Prop()
  @Field({ defaultValue: "" })
  zipEntryPoint!: string;

  @Prop()
  @Field({ defaultValue: "" })
  apsUrnKey!: string;

  @Prop()
  @Field({ nullable: true, defaultValue: "" })
  apsObjKey!: string;
}


@InputType()
export class UploadFileInput {

  @Field({ nullable: true })
  fileId!: string;

  @Field({ nullable: true })
  revisionId!: string;

  @Field()
  fileName!: string;

  @Field()
  originalname!: string;

  @Field()
  path!: string;

  // @Prop()
  @Field()
  folderId!: string; ////////////

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

  @Field({ nullable: true })
  zipEntryPoint!: string;

  @Field({ nullable: true })
  apsUrnKey!: string;

  @Field({ nullable: true })
  apsObjKey!: string;
}


//// PaginationInput for File Schema
@InputType()
export class PaginationInputF {
  @Field()
  pageSize!: number;

  @Field()
  currentPage!: number;

  @Field()
  folderId!: string; // in pagination  folderId
}

@ObjectType()
export class PaginationResultF {
  @Field(() => Int)
  totalFiles!: number;

  @Field(() => Int)
  totalPages!: number;



  @Field(() => [File])
  files!: File[];

  @Field(() => Int)
  currentPage!: number;
}

@InputType()
export class DeleteFileInput {
  @Field()
  fileId!: string;
}

/// FOR DOWNLOAD {GET SINGLE FILE } ***************

@InputType()
export class GetSingleFileInput {
  @Field()
  revisionId!: string;
}

export const FileSchema = SchemaFactory.createForClass(File);