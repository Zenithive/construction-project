import { Resolver, Mutation, Args,Query } from '@nestjs/graphql';
import { SelectedProjectService } from './selected_projects.service';
import { SelectedProject, AddSelectedProjectInput, RemoveSelectedProjectInput } from './selected_project.schema';

@Resolver(() => SelectedProject)
export class SelectedProjectResolver {
  constructor(private readonly selectedProjectService: SelectedProjectService) {}

  @Query(() => [SelectedProject])
  async getSelectedProjects(@Args('input') userId: string): Promise<SelectedProject[]> {
    return this.selectedProjectService.getSelectedProjects(userId);
  }

  @Mutation(() => SelectedProject)
  async addSelectedProject(@Args('input') input: AddSelectedProjectInput): Promise<SelectedProject> {
    return this.selectedProjectService.addSelectedProject(input);
  }

  @Mutation(() => SelectedProject)
  async removeSelectedProject(@Args('input') input: RemoveSelectedProjectInput): Promise<SelectedProject | null> {
    return this.selectedProjectService.removeSelectedProject(input);
  }
}
