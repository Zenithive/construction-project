// selected-project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SelectedProject, SelectedProjectDocument, RemoveSelectedProjectInput } from './selected-project.schema';

@Injectable()
export class SelectedProjectService {
  constructor(@InjectModel(SelectedProject.name) private readonly selectedProjectModel: Model<SelectedProjectDocument>) {}

  async getSelectedProjects(userId:string): Promise<SelectedProject[]> {
    return this.selectedProjectModel.find({userId}).exec();
  }

  async addSelectedProject(input: SelectedProject): Promise<SelectedProject> {
    const existingProject = await this.selectedProjectModel.findOne({ projName:input.projName,userId:input.userId }).exec();

    if (existingProject) {
      throw new Error(`Project with Name ${input.projName} already exists.`);
    } else {
      const createdSelectedProject = new this.selectedProjectModel(input);
      return createdSelectedProject.save();
    }
  }

  async removeSelectedProject(input: RemoveSelectedProjectInput): Promise<SelectedProject | null> {
    const { projId,userId } = input;
    try {
      const removedProject = await this.selectedProjectModel.findOneAndDelete({ projId,userId}).exec();
      console.log("removedProject var",removedProject)
      if (!removedProject) {
        throw new NotFoundException(`Selected project with id ${projId} not found.`);
      }
      console.log("removedProject after returen ",removedProject)
      return removedProject;
    } catch (error) {
      console.error('Error removing selected project:', error);
      throw new Error('Failed to remove selected project.');
    }
  }
}
