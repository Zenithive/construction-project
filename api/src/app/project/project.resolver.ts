import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { ProjectService } from './project.service'
import { Project, CreateProjectInput, DeleteProjectInput } from './project.schema'

@Resolver()
export class ProjectResolver {
  constructor(
    private projService: ProjectService,
  ) {}

  @Query(() => [Project])
  async getProjects() {
    return this.projService.getProjects();
  }

  @Mutation(() => Project)
  async createProject(@Args('input') project: CreateProjectInput) {
    return this.projService.createProject(project);
  }

  @Mutation(() => Project)
  async deleteProject(@Args('input') project: DeleteProjectInput) {
    return this.projService.deleteProject(project.projId);
  }



}