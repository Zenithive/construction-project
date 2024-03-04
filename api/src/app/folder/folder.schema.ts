import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType} from '@nestjs/graphql';

export type FolderDocument = Folder & Document;

@Schema()
@ObjectType()
export class Folder {

  @Prop()
  @Field({ nullable: true })
  folderId!: string;

  @Prop()
  @Field()
  folderName!: string;

  @Prop()
  @Field()
  projectId!: string;

  @Prop()
  @Field()
  orgId!: string;

  @Prop()
  @Field()
  parentFolderId!: string;

  @Prop()
  @Field()
  orginatorId!: string;

  @Prop()
  @Field()
  status!: string;    
}


@InputType()
export class CreateFolderInput{

    @Field({ nullable: true })
    folderId!: string;

    @Field()
    folderName!: string;

    @Field()
    parentFolderId!: string;

    @Field()
    orginatorId!: string;

    @Field()
    orgId!: string;    

    @Field({ nullable: true, defaultValue: "Active" })
    status!: string;    

    @Field()
    projectId!: string;
}


export const FolderSchema = SchemaFactory.createForClass(Folder);