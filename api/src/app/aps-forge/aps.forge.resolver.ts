import { Resolver, Mutation, Query, Args } from '@nestjs/graphql'
import { ApsForgeService } from './aps.forge.service'
import { ApsForge, CreateApsForgeInput } from './aps.forge.schema'
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';


//@Resolver()
@Controller('aps')
export class ApsForgeResolver {
  constructor(
    private apsForgeService: ApsForgeService,
  ) {}

  // @Query(() => [ApsForge])
  // async getApsForgeToken() {
  //   return this.apsForgeService.getAuthToken();
  // }

  @Get("/getApsForgeModels")
  async getApsForgeModels(@Res() res: Response) {
    const data = await this.apsForgeService.getModels();
    res.status(HttpStatus.OK).json(data);
  }

  @Get("/getApsForgeToken")
  async getApsForgeToken(@Res() res: Response) {
    const data = await this.apsForgeService.getAuthToken();
    res.status(HttpStatus.OK).json(data);
  }

  // @Query(() => [ApsForge])
  // async getApsForgeUrnStatus() {
  //   return this.apsForgeService.getModels();
  // }

  // @Query(() => [ApsForge])
  // async uploadApsForgeModels() {
  //   return this.apsForgeService.getModels();
  // }
  
}